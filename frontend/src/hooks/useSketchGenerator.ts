"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface SketchParams {
  blur_amount: number;
  edge_threshold_low: number;
  edge_threshold_high: number;
  line_thickness: number;
}

export interface QuotaInfo {
  used: number;
  limit: number;
}

const DEFAULT_PARAMS: SketchParams = {
  blur_amount: 5,
  edge_threshold_low: 50,
  edge_threshold_high: 150,
  line_thickness: 1,
};

const STORAGE_KEYS = {
  params: "ib_sketch_params",
  preview: "ib_sketch_preview",
  imageBase64: "ib_sketch_image_b64",
  imageName: "ib_sketch_image_name",
  imageMime: "ib_sketch_image_mime",
};

function loadParams(): SketchParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.params);
    return raw ? { ...DEFAULT_PARAMS, ...JSON.parse(raw) } : DEFAULT_PARAMS;
  } catch {
    return DEFAULT_PARAMS;
  }
}

function loadPreview(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.preview);
  } catch {
    return null;
  }
}

async function loadImageFile(): Promise<File | null> {
  try {
    const b64 = sessionStorage.getItem(STORAGE_KEYS.imageBase64);
    const name = sessionStorage.getItem(STORAGE_KEYS.imageName);
    const mime = sessionStorage.getItem(STORAGE_KEYS.imageMime);
    if (!b64 || !name || !mime) return null;
    const res = await fetch(b64);
    const blob = await res.blob();
    return new File([blob], name, { type: mime });
  } catch {
    return null;
  }
}

function saveParams(params: SketchParams) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.params, JSON.stringify(params));
  } catch {}
}

function saveImage(file: File, preview: string) {
  try {
    sessionStorage.setItem(STORAGE_KEYS.preview, preview);
    sessionStorage.setItem(STORAGE_KEYS.imageName, file.name);
    sessionStorage.setItem(STORAGE_KEYS.imageMime, file.type);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(
          STORAGE_KEYS.imageBase64,
          reader.result as string
        );
      } catch {}
    };
    reader.readAsDataURL(file);
  } catch {}
}

export function useSketchGenerator() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [params, setParams] = useState<SketchParams>(DEFAULT_PARAMS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewResult, setPreviewResult] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const savedParams = loadParams();
    setParams(savedParams);

    const savedPreview = loadPreview();
    if (savedPreview) setPreview(savedPreview);

    loadImageFile().then((file) => {
      if (file) setImage(file);
    });
  }, []);

  function handleFileChange(file: File) {
    setImage(file);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    saveImage(file, url);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  }

  function updateParam(key: keyof SketchParams, value: number) {
    setParams((p) => {
      const updated = { ...p, [key]: value };
      saveParams(updated);
      return updated;
    });
  }

  async function handleGenerate() {
    if (!image) return;
    setIsGenerating(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("blur_amount", String(params.blur_amount));
    formData.append("edge_threshold_low", String(params.edge_threshold_low));
    formData.append("edge_threshold_high", String(params.edge_threshold_high));
    formData.append("line_thickness", String(params.line_thickness));

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          res.status === 429
            ? "Daily quota exceeded. Upgrade to Pro for more generations."
            : data.detail ?? "Something went wrong."
        );
        return;
      }

      setResult(data.result_url);
      setQuota({ used: data.generations_used, limit: data.daily_limit });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const handlePreview = useCallback(async () => {
    if (!image) return;
    setIsPreviewing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("blur_amount", String(params.blur_amount));
    formData.append("edge_threshold_low", String(params.edge_threshold_low));
    formData.append("edge_threshold_high", String(params.edge_threshold_high));
    formData.append("line_thickness", String(params.line_thickness));

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail ?? "Preview failed.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewResult(url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsPreviewing(false);
    }
  }, [image, params]);

  // Debounced auto-preview
  useEffect(() => {
    if (!image) return;
    const timer = setTimeout(() => {
      handlePreview();
    }, 500);
    return () => clearTimeout(timer);
  }, [params, image, handlePreview]);

  return {
    image,
    preview,
    result,
    previewResult,
    isGenerating,
    isPreviewing,
    error,
    quota,
    params,
    fileInputRef,
    handleFileChange,
    handleDrop,
    updateParam,
    handleGenerate,
    handlePreview,
  };
}