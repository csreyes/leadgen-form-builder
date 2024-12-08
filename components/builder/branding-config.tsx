"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ModalConfig } from "@/lib/types";
import { fileToBase64, isBase64Image } from "@/lib/utils";

interface BrandingConfigProps {
  config: ModalConfig;
  onChange: (config: ModalConfig) => void;
}

export function BrandingConfig({ config, onChange }: BrandingConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
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
        console.error("Failed to convert image to base64:", error);
      }
    }
  };

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...config,
      branding: {
        ...config.branding,
        companyName: event.target.value,
      },
    });
  };

  const handleLogoBase64Change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...config,
      branding: {
        ...config.branding,
        logo: event.target.value,
      },
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Branding</h2>
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            value={config.branding?.companyName || ""}
            onChange={handleCompanyNameChange}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label>Logo</Label>
          <div className="mt-2 space-y-4">
            {config.branding?.logo && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={config.branding.logo}
                    alt={config.branding.companyName || "Company Logo"}
                    className="h-8 w-auto object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      onChange({
                        ...config,
                        branding: {
                          ...config.branding,
                          logo: undefined,
                        },
                      })
                    }
                  >
                    Remove Logo
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Base64 Data</Label>
                  <Input
                    value={config.branding.logo}
                    onChange={handleLogoBase64Change}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            )}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {config.branding?.logo ? "Change Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
