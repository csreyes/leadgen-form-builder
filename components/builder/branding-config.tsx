"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ModalConfig } from "@/lib/types";

interface BrandingConfigProps {
  config: ModalConfig;
  onChange: (config: ModalConfig) => void;
}

export function BrandingConfig({ config, onChange }: BrandingConfigProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...config,
          branding: {
            ...config.branding,
            logo: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
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
