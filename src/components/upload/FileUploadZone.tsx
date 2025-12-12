import { useCallback, useState } from "react";
import { Upload, X, FileIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  label?: string;
}

export function FileUploadZone({
  accept = "image/*",
  multiple = true,
  onFilesSelected,
  maxFiles = 10,
  label = "Upload Files",
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, maxFiles));
      onFilesSelected?.(droppedFiles);
    },
    [maxFiles, onFilesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []).slice(0, maxFiles);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, maxFiles));
      onFilesSelected?.(selectedFiles);
    },
    [maxFiles, onFilesSelected]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">{label}</label>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>

        <p className="text-sm font-medium">
          Drag and drop files here, or{" "}
          <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Maximum {maxFiles} files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-5 w-5 text-info" />
                ) : (
                  <FileIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
