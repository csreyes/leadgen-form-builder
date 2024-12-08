"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { fileToBase64, isBase64Image } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onChange(base64);
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex items-center gap-4">
        {value && isBase64Image(value) && (
          <div className="relative w-32 h-8">
            <img
              src={value}
              alt={label || "Uploaded image"}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {value ? "Change Image" : "Upload Image"}
        </Button>
      </div>
    </div>
  );
}
