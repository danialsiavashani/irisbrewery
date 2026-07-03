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

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Left pane — style tabs + thumbnail + controls + buttons */}
      <div className="flex w-1/2 flex-col gap-3 overflow-hidden border-r p-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Original
          </p>
          <div className="flex h-40 gap-2">
            <div className="w-1/2">
              <StyleTabs activeStyle={activeStyle} onStyleChange={setActiveStyle} />
            </div>
            <div className="w-1/2">
              <ImageUpload
                preview={preview}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onDrop={handleDrop}
                className="h-full p-3"
              />
            </div>
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
            <a href={result} download="sketch.png" className="w-full">
              <Button variant="outline" className="w-full">
                Download
              </Button>
            </a>
          )}
        </div>
      </div>

     {/* Right pane — sketch result */}
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
  );
}