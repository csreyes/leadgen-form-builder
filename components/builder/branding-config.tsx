"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ModalConfig } from "@/lib/types";
import { fileToBase64, isBase64Image } from "@/lib/utils";
import Image from "next/image";

interface BrandingConfigProps {
  config: ModalConfig;
  onChange: (config: ModalConfig) => void;
}

export function BrandingConfig({ config, onChange }: BrandingConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      onChange({
        ...config,
        branding: {
          ...config.branding,
          logo: base64,
        },
      });
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Branding</h3>

      <div className="space-y-2">
        <Label>Company Name</Label>
        <Input
          value={config.branding?.companyName || ""}
          onChange={(e) =>
            onChange({
              ...config,
              branding: {
                ...config.branding,
                companyName: e.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
            {config.branding?.logo && isBase64Image(config.branding.logo) ? (
              <div className="relative w-full h-full">
                <Image
                  src={config.branding.logo}
                  alt={config.branding?.companyName || "Company Logo"}
                  fill
                  className="object-contain"
                  unoptimized // Since we're using base64
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400">No logo</span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            Upload Logo
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Recommended size: 200x50px. Max file size: 1MB
        </p>
      </div>
    </Card>
  );
}
