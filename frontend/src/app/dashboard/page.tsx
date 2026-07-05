"use client";

import { useState } from "react";
import { useSketchGenerator } from "@/hooks/useSketchGenerator";
import { ImageUpload } from "@/components/image-upload";
import { SketchControls } from "@/components/sketch-controls";
import { QuotaDisplay } from "@/components/quota-display";
import { StyleTabs } from "@/components/style-tabs";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [activeStyle, setActiveStyle] = useState("sketch");

  const {
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
    image,
  } = useSketchGenerator();

  const quotaExceeded = quota && quota.used >= quota.limit;

  function handleDownload() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = `/api/download?url=${encodeURIComponent(result)}`;
    a.download = "sketch.png";
    a.click();
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex flex-col w-full h-full md:hidden">

        {/* Top 70% — result */}
        <div className="flex flex-col h-[62vh] min-h-0 p-3 gap-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide shrink-0">
            {result ? "Sketch" : previewResult ? "Preview" : "Result"}
          </p>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-3">
            {isPreviewing && (
              <p className="text-sm text-muted-foreground">Processing...</p>
            )}
            {!isPreviewing && previewResult && !result && (
              <img
                src={previewResult}
                alt="Watermarked preview"
                className="h-full w-full rounded-xl object-contain"
              />
            )}
            {!isPreviewing && result && (
              <img
                src={result}
                alt="Sketch result"
                className="h-full w-full rounded-xl object-contain"
              />
            )}
            {!isPreviewing && !previewResult && !result && (
              <p className="text-sm text-muted-foreground">
                Upload a photo to see the result
              </p>
            )}
          </div>
        </div>

        {/* Bottom 30% — controls */}
        <div className="flex flex-col gap-2 border-t p-3 overflow-y-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <StyleTabs activeStyle={activeStyle} onStyleChange={setActiveStyle} />
            </div>
            <div className="h-10 w-16 shrink-0">
              <ImageUpload
                preview={preview}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onDrop={handleDrop}
                className="h-full p-1"
              />
            </div>
          </div>
          <SketchControls params={params} onParamChange={updateParam} />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {quota && <QuotaDisplay quota={quota} />}
          <div className="flex gap-2">
            {!result ? (
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!image || isPreviewing}
                className="flex-1"
              >
                {isPreviewing ? "Previewing..." : "Preview"}
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                Download
              </Button>
            )}
            {!quotaExceeded ? (
              <Button
                onClick={handleGenerate}
                disabled={!image || isGenerating}
                className="flex-1"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            ) : (
              <Button className="flex-1">Upgrade</Button>
            )}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex w-full h-full">

        {/* Left pane */}
        <div className="flex w-1/2 flex-col gap-3 overflow-hidden border-r p-6">
          <div className="shrink-0">
            <StyleTabs activeStyle={activeStyle} onStyleChange={setActiveStyle} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Original
            </p>
            <div className="h-40 w-full">
              <ImageUpload
                preview={preview}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onDrop={handleDrop}
                className="h-full p-3"
              />
            </div>
          </div>
          <SketchControls params={params} onParamChange={updateParam} />
          <div className="flex shrink-0 flex-col gap-2">
            {error && <p className="text-xs text-destructive">{error}</p>}
            {quota && <QuotaDisplay quota={quota} />}
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!image || isPreviewing}
              className="w-full"
            >
              {isPreviewing ? "Previewing..." : "Preview"}
            </Button>
            {!quotaExceeded ? (
              <Button
                onClick={handleGenerate}
                disabled={!image || isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Sketch"}
              </Button>
            ) : (
              <Button className="w-full">Upgrade to Pro</Button>
            )}
            {result && (
              <Button variant="outline" className="w-full" onClick={handleDownload}>
                Download
              </Button>
            )}
          </div>
        </div>

        {/* Right pane */}
        <div className="flex h-full w-1/2 min-h-0 flex-col gap-2 p-6">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide shrink-0">
            {result ? "Sketch" : previewResult ? "Preview" : "Result"}
          </p>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-4">
            {isPreviewing && (
              <p className="text-sm text-muted-foreground">Processing...</p>
            )}
            {!isPreviewing && previewResult && !result && (
              <img
                src={previewResult}
                alt="Watermarked preview"
                className="h-full w-full rounded-xl object-contain"
              />
            )}
            {!isPreviewing && result && (
              <img
                src={result}
                alt="Sketch result"
                className="h-full w-full rounded-xl object-contain"
              />
            )}
            {!isPreviewing && !previewResult && !result && (
              <p className="text-sm text-muted-foreground">
                Upload a photo to see the result
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}