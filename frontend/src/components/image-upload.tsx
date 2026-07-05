"use client";

import { Upload } from "lucide-react";

interface ImageUploadProps {
  preview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file: File) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  className?: string;
}

export function ImageUpload({
  preview,
  fileInputRef,
  onFileChange,
  onDrop,
  className = "min-h-96 p-8",
}: ImageUploadProps) {
  return (
    <div
      className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-ring transition-colors ${className}`}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInputRef.current?.click()}
    >
      {/* Desktop — show image preview or drag-drop text */}
      <div className="hidden md:flex flex-col items-center justify-center w-full h-full gap-2">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP supported
            </p>
          </>
        )}
      </div>

      {/* Mobile — always small tap target, never shows image */}
      <div className="flex md:hidden flex-col items-center gap-1">
        <Upload className="h-4 w-4 text-muted-foreground" />
        <p className="text-[10px] leading-tight text-center text-muted-foreground">
          {preview ? "Replace" : "Upload"}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
        }}
      />
    </div>
  );
}