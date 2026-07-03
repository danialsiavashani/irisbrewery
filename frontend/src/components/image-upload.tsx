"use client";

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