"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { TrustedLogo } from "@/lib/types";
import { ImageUpload } from "./image-upload";

interface TrustedLogosProps {
  logos: TrustedLogo[];
  onChange: (logos: TrustedLogo[]) => void;
}

export function TrustedLogos({ logos, onChange }: TrustedLogosProps) {
  const addLogo = () => {
    const newLogos = [
      ...logos,
      { id: crypto.randomUUID(), url: "", alt: "Logo Alt" },
    ];
    onChange(newLogos);
  };

  const updateLogo = (index: number, field: "url" | "alt", value: string) => {
    const newLogos = [...logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    onChange(newLogos);
  };

  const removeLogo = (index: number) => {
    const newLogos = [...logos];
    newLogos.splice(index, 1);
    onChange(newLogos);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Trusted By Logos (Ticker)</Label>
        <Button variant="outline" size="sm" onClick={addLogo}>
          <Plus className="w-4 h-4 mr-2" />
          Add Logo
        </Button>
      </div>
      <div className="space-y-2">
        {logos.map((logo, index) => (
          <Card key={logo.id} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Logo URL or Upload Image</Label>
              <Input
                value={logo.url}
                onChange={(e) => updateLogo(index, "url", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-gray-500">
                You can paste a URL, or upload an image file below.
              </p>
              <ImageUpload
                value={logo.url.startsWith("data:") ? logo.url : ""}
                onChange={(val) => updateLogo(index, "url", val)}
                label="Logo Image"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={logo.alt}
                onChange={(e) => updateLogo(index, "alt", e.target.value)}
                placeholder="Logo description"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600"
              onClick={() => removeLogo(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
