"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ModalConfig } from "@/lib/types";

interface StyleConfigProps {
  config: ModalConfig;
  onChange: (config: ModalConfig) => void;
}

const fontOptions = [
  { value: "inter", label: "Inter" },
  { value: "helvetica", label: "Helvetica" },
  { value: "arial", label: "Arial" },
  { value: "roboto", label: "Roboto" },
  { value: "system", label: "System Default" },
];

export function StyleConfig({ config, onChange }: StyleConfigProps) {
  const updateStyle = (updates: Partial<NonNullable<ModalConfig["style"]>>) => {
    onChange({
      ...config,
      style: {
        ...config.style,
        ...updates,
      },
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Global Styles</h3>

      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={config.style?.fontFamily || "system"}
          onValueChange={(value) => updateStyle({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={config.style?.primaryColor || "#f97316"}
            onChange={(e) => updateStyle({ primaryColor: e.target.value })}
            placeholder="#f97316"
            className="flex-1"
          />
          <Input
            type="color"
            value={config.style?.primaryColor || "#f97316"}
            onChange={(e) => updateStyle({ primaryColor: e.target.value })}
            className="w-12 p-1 h-9"
          />
        </div>
        <p className="text-sm text-gray-500">
          Used for buttons, progress bars, and accents
        </p>
      </div>

      <div className="space-y-2">
        <Label>Secondary Color</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={config.style?.secondaryColor || "#000000"}
            onChange={(e) => updateStyle({ secondaryColor: e.target.value })}
            placeholder="#000000"
            className="flex-1"
          />
          <Input
            type="color"
            value={config.style?.secondaryColor || "#000000"}
            onChange={(e) => updateStyle({ secondaryColor: e.target.value })}
            className="w-12 p-1 h-9"
          />
        </div>
        <p className="text-sm text-gray-500">
          Used for secondary buttons and elements
        </p>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={config.style?.textColor || "#000000"}
            onChange={(e) => updateStyle({ textColor: e.target.value })}
            placeholder="#000000"
            className="flex-1"
          />
          <Input
            type="color"
            value={config.style?.textColor || "#000000"}
            onChange={(e) => updateStyle({ textColor: e.target.value })}
            className="w-12 p-1 h-9"
          />
        </div>
        <p className="text-sm text-gray-500">Used for main text content</p>
      </div>

      <div className="space-y-2">
        <Label>Left Panel Color</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={config.style?.leftPanelColor || "#f97316"}
            onChange={(e) => updateStyle({ leftPanelColor: e.target.value })}
            placeholder="#f97316"
            className="flex-1"
          />
          <Input
            type="color"
            value={config.style?.leftPanelColor || "#f97316"}
            onChange={(e) => updateStyle({ leftPanelColor: e.target.value })}
            className="w-12 p-1 h-9"
          />
        </div>
        <p className="text-sm text-gray-500">
          Background color for the left panel
        </p>
      </div>

      <div className="space-y-2">
        <Label>Right Panel Color</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={config.style?.rightPanelMainColor || "#FFFFFF"}
            onChange={(e) =>
              updateStyle({ rightPanelMainColor: e.target.value })
            }
            placeholder="#FFFFFF"
            className="flex-1"
          />
          <Input
            type="color"
            value={config.style?.rightPanelMainColor || "#FFFFFF"}
            onChange={(e) =>
              updateStyle({ rightPanelMainColor: e.target.value })
            }
            className="w-12 p-1 h-9"
          />
        </div>
        <p className="text-sm text-gray-500">
          Background color for the right panel
        </p>
      </div>
    </Card>
  );
}
