"use client";

import { useSketchGenerator } from "@/hooks/useSketchGenerator";
import { ImageUpload } from "@/components/image-upload";
import { SketchControls } from "@/components/sketch-controls";
import { QuotaDisplay } from "@/components/quota-display";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
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
  <div className="flex flex-1 gap-4 p-4 max-w-7xl mx-auto w-full">

    {/* Left sidebar — controls + buttons */}
    <div className="flex flex-col gap-4 w-56 shrink-0">
      <SketchControls params={params} onParamChange={updateParam} />
      <div className="flex flex-col gap-2">
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
            <Button variant="outline" className="w-full">Download</Button>
          </a>
        )}
      </div>
    </div>

    {/* Center — small original photo */}
    <div className="flex flex-col gap-2 w-80 shrink-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Original</p>
      <ImageUpload
        preview={preview}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onDrop={handleDrop}
      />
    </div>

    {/* Right — sketch result */}
    <div className="flex flex-col gap-2 w-80 shrink-0">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {result ? "Sketch" : previewResult ? "Preview" : "Result"}
      </p>
      <div className="flex items-center justify-center border-2 border-dashed rounded-xl p-4 h-80">
        {isPreviewing && (
          <p className="text-sm text-muted-foreground">Processing...</p>
        )}
        {!isPreviewing && previewResult && !result && (
          <img
            src={previewResult}
            alt="Watermarked preview"
            className="max-h-72 max-w-full rounded-xl object-contain"
          />
        )}
        {!isPreviewing && result && (
          <img
            src={result}
            alt="Sketch result"
            className="max-h-72 max-w-full rounded-xl object-contain"
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