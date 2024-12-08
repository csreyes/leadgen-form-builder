# Project Files Content

## App Directory

### app/embed/[id]/client-modal.tsx

"use client";

import { ModalContent } from "@/components/signup/modal-content";
import { FormData, ModalConfig } from "@/lib/types";

export function ClientModalContent({ config }: { config: ModalConfig }) {
  const handleSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);
    // Here you can implement the actual form submission logic
  };

  return <ModalContent config={config} onSubmit={handleSubmit} />;
}



### app/embed/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { ModalConfig } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ClientForm } from "@/components/signup/client-form";

export default function EmbedPage({ params }: { params: { id: string } }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from("modal_configs")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setError("Failed to load modal configuration");
        return;
      }

      setConfig(data.config as ModalConfig);
    }

    fetchConfig();
  }, [params.id]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!config) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen overflow-auto">
      <ClientForm config={config} />
    </div>
  );
}



### app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenPipe - Train Faster, Cheaper Models",
  description:
    "OpenPipe helps you fine-tune and deploy models that are faster and cheaper than GPT-4, trained on your production data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Toaster />
        {children}
      </body>
    </html>
  );
}



### app/api/modal-config/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { config, publish = false } = await request.json();

    const { data, error } = await supabase
      .from("modal_configs")
      .insert([
        {
          config,
          published: publish,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const embedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/embed/${data.id}`;

    return NextResponse.json({ success: true, data: { ...data, embedUrl } });
  } catch (error) {
    console.error("Error saving modal config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save modal config" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing config ID" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("modal_configs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching modal config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch modal config" },
      { status: 500 }
    );
  }
}



### app/page.tsx

"use client";

import { useState } from "react";
import { SignupModal } from "@/components/signup/signup-modal";
import { ModalBuilder } from "@/components/builder/modal-builder";
import { ModalConfig, StepConfig, Step, TrustedLogo } from "@/lib/types";
import { placeholderLogos } from "@/lib/placeholder-logos";

// Example trusted logos using base64 placeholders
const sampleLogos = placeholderLogos;

// Base64 placeholder for avatar
const placeholderAvatar =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const defaultPanelContent = {
  main: {
    headline: "Train faster, cheaper models on production data",
    valueProps: [
      { icon: "Layers", text: "Train & deploy fine-tuned models" },
      { icon: "DollarSign", text: "Save time and money" },
      { icon: "Sparkles", text: "Get higher quality than OpenAI" },
    ],
    trustedByLogos: sampleLogos,
  },
  "value-props": {
    headline: "Why use OpenPipe?",
    stats: [
      { value: "14x", label: "Cheaper than GPT-4 Turbo", icon: "ChevronDown" },
      {
        value: "5min",
        label: "To start collecting training data",
        icon: "ChevronRight",
      },
      {
        value: "$7M",
        label: "Saved by our customers this year",
        icon: "ChevronUp",
      },
    ],
  },
  testimonial: {
    headline: "What our users say",
    quote:
      "OpenPipe increased our inference speed by 3x compared to GPT4-turbo while reducing cost by >10x.",
    author: {
      name: "John Doe",
      title: "CEO & Co-founder",
      avatar: placeholderAvatar,
    },
  },
  features: {
    headline: "Your AI Infrastructure Platform",
    features: [
      {
        title: "Data Collection & Processing",
        description: "Automatically collect and process your production data",
        icon: "Database",
      },
      {
        title: "Model Training & Fine-tuning",
        description: "Train custom models on your specific use cases",
        icon: "Cpu",
      },
      {
        title: "Automated Deployment",
        description: "Deploy models with zero-downtime updates",
        icon: "Rocket",
      },
    ],
  },
  success: {
    headline: "You're all set!",
    subheadline: "We'll reach out soon with next steps",
    features: [
      { title: "Access to dashboard", icon: "Layers" },
      { title: "Training data collection", icon: "Database" },
      { title: "Model deployment tools", icon: "Rocket" },
      { title: "Performance analytics", icon: "LineChart" },
    ],
  },
};

const defaultConfig: ModalConfig = {
  headline: "Train faster, cheaper models on production data",
  valueProps: [
    { icon: "Layers", text: "Train & deploy fine-tuned models" },
    { icon: "DollarSign", text: "Save time and money" },
    { icon: "Sparkles", text: "Get higher quality than OpenAI" },
  ],
  logo: "",
  trustedByLogos: sampleLogos,
  branding: {
    companyName: "OpenPipe",
  },
  steps: [
    {
      headline: "Let's get started",
      subheadline:
        "Please answer a few questions so we can create your account.",
      panelType: "main",
      panelContent: defaultPanelContent.main,
      fields: [
        {
          id: "email",
          label: "Work Email",
          type: "email",
          required: true,
          fullWidth: true,
        },
        {
          id: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          fullWidth: false,
        },
        {
          id: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          fullWidth: false,
        },
      ],
    },
    {
      headline: "Which model(s) do you currently use in production?",
      subheadline: "You can select multiple options.",
      panelType: "value-props",
      panelContent: defaultPanelContent["value-props"],
      fields: [
        {
          id: "currentModels",
          label: "Models",
          type: "select", // treat multi-select as single for simplicity
          required: true,
          fullWidth: true,
          options: ["GPT-4", "GPT-3.5", "Claude", "Mixtral", "Gemini", "Other"],
        },
      ],
    },
    {
      headline: "About how many LLM calls does your project make per day?",
      subheadline: "",
      panelType: "testimonial",
      panelContent: defaultPanelContent.testimonial,
      fields: [
        {
          id: "dailyCalls",
          label: "Daily Calls",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            "< 1,000",
            "1,000 to 10,000",
            "10,000 to 50,000",
            "50,000 to 100,000",
            "> 100,000",
          ],
        },
      ],
    },
    {
      headline: "Anything else?",
      subheadline: "How did you hear about us?",
      panelType: "features",
      panelContent: defaultPanelContent.features,
      fields: [
        {
          id: "source",
          label: "How did you hear about us?",
          type: "select",
          required: true,
          fullWidth: true,
          options: [
            "Twitter",
            "LinkedIn",
            "Friend or colleague",
            "Search engine",
            "Other",
          ],
        },
        {
          id: "comments",
          label: "Any additional comments or questions?",
          type: "textarea",
          required: false,
          fullWidth: true,
        },
      ],
    },
    {
      headline: "Thanks!",
      subheadline: "We'll be in touch shortly.",
      panelType: "success",
      panelContent: defaultPanelContent.success,
      fields: [],
    },
  ],
};

export default function Home() {
  const [config, setConfig] = useState<ModalConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState<Step>(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        {/* Left side - Builder */}
        <div className="w-1/2 overflow-auto p-8 border-r">
          <h1 className="text-3xl font-bold mb-8">Signup Modal Builder</h1>
          <ModalBuilder
            config={config}
            onChange={setConfig}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>

        {/* Right side - Preview */}
        <div className="w-1/2 bg-black/80 flex items-center justify-center overflow-auto">
          <SignupModal
            open={true}
            onOpenChange={() => {}}
            config={config}
            initialStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}



### app/test-iframe/layout.tsx

export const metadata = {
  title: "Signup Modal",
  description: "Customizable signup modal",
};

export default function IframeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent m-0 p-0 min-h-screen">{children}</body>
    </html>
  );
}



### app/test-iframe/page.tsx

"use client";

import { ModalContent } from "@/components/signup/modal-content";
import { FormData, ModalConfig } from "@/lib/types";
import { placeholderLogos } from "@/lib/placeholder-logos";

const config: ModalConfig = {
  headline: "Train faster, cheaper models on production data",
  valueProps: [
    { icon: "Layers", text: "Train & deploy fine-tuned models" },
    { icon: "DollarSign", text: "Save time and money" },
    { icon: "Sparkles", text: "Get higher quality than OpenAI" },
  ],
  logo: "",
  trustedByLogos: placeholderLogos,
  steps: [
    {
      headline: "Get started with OpenPipe",
      subheadline: "Create your account to start fine-tuning models",
      panelType: "main",
      panelContent: {
        headline: "Train faster, cheaper models",
        valueProps: [
          { icon: "Layers", text: "Fine-tune models in minutes" },
          { icon: "DollarSign", text: "Cut costs by 10-100x" },
          { icon: "Rocket", text: "Deploy anywhere" },
          { icon: "LineChart", text: "Evaluate & monitor performance" },
        ],
        trustedByLogos: placeholderLogos,
        logoDisplayMode: "ticker",
      },
      fields: [
        {
          id: "email",
          type: "email",
          label: "Work Email",
          required: true,
          fullWidth: true,
        },
        {
          id: "firstName",
          type: "text",
          label: "First Name",
          required: true,
          fullWidth: false,
        },
        {
          id: "lastName",
          type: "text",
          label: "Last Name",
          required: true,
          fullWidth: false,
        },
      ],
    },
    {
      headline: "Tell us about your models",
      subheadline: "We'll help you optimize your workflow",
      panelType: "value-props",
      panelContent: {
        headline: "Why use OpenPipe?",
        stats: [
          {
            value: "14x",
            label: "Cheaper than GPT-4 Turbo",
            icon: "ChevronDown",
          },
          {
            value: "5min",
            label: "To start collecting training data",
            icon: "ChevronRight",
          },
          {
            value: "$7M",
            label: "Saved by our customers this year",
            icon: "ChevronUp",
          },
        ],
      },
      fields: [
        {
          id: "currentModels",
          type: "select",
          label: "Current Models",
          required: true,
          fullWidth: true,
          options: ["GPT-4", "GPT-3.5", "Claude", "Llama 2", "Other"],
        },
      ],
    },
  ],
  style: {
    leftPanelColor: "#f97316",
    rightPanelMainColor: "#FFFFFF",
  },
  branding: {
    companyName: "OpenPipe",
  },
};

export default function TestIframePage() {
  const handleSubmit = (formData: FormData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full min-h-screen overflow-auto">
      <ModalContent config={config} onSubmit={handleSubmit} />
    </div>
  );
}




## Components/Builder Directory

### components/builder/image-upload.tsx

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



### components/builder/trusted-logos.tsx

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



### components/builder/style-config.tsx

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



### components/builder/left-panel-builder.tsx

"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Info, Palette } from "lucide-react";
import { type StepConfig, type PanelType } from "@/lib/types";
import { TrustedLogos } from "./trusted-logos";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LeftPanelBuilderProps {
  step: StepConfig;
  onChange: (updates: Partial<StepConfig>) => void;
}

function generateGradients(baseColor: string) {
  const hexToHSL = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const HSLToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const baseHSL = hexToHSL(baseColor);

  const complementary = HSLToHex((baseHSL.h + 180) % 360, baseHSL.s, baseHSL.l);

  const analogous1 = HSLToHex((baseHSL.h + 30) % 360, baseHSL.s, baseHSL.l);
  const analogous2 = HSLToHex((baseHSL.h - 30) % 360, baseHSL.s, baseHSL.l);

  const triadic1 = HSLToHex((baseHSL.h + 120) % 360, baseHSL.s, baseHSL.l);
  const triadic2 = HSLToHex((baseHSL.h + 240) % 360, baseHSL.s, baseHSL.l);

  return [
    {
      name: "Complementary",
      value: `linear-gradient(to right, ${baseColor}, ${complementary})`,
    },
    {
      name: "Analogous Warm",
      value: `linear-gradient(to right, ${baseColor}, ${analogous1})`,
    },
    {
      name: "Analogous Cool",
      value: `linear-gradient(to right, ${baseColor}, ${analogous2})`,
    },
    {
      name: "Triadic Bold",
      value: `linear-gradient(to right, ${baseColor}, ${triadic1})`,
    },
    {
      name: "Triadic Soft",
      value: `linear-gradient(to right, ${baseColor}, ${triadic2}, ${baseColor})`,
    },
    {
      name: "Monochromatic",
      value: `linear-gradient(to right, ${baseColor}, ${HSLToHex(
        baseHSL.h,
        baseHSL.s,
        Math.min(baseHSL.l + 20, 100)
      )})`,
    },
  ];
}

export function LeftPanelBuilder({ step, onChange }: LeftPanelBuilderProps) {
  const [baseColor, setBaseColor] = React.useState("#f97316");

  const ColorPicker = ({
    value,
    onChange,
  }: {
    value: string | undefined;
    onChange: (value: string) => void;
  }) => {
    React.useEffect(() => {
      if (value?.startsWith("#")) {
        setBaseColor(value);
      }
    }, [value]);

    const handleBaseColorChange = (color: string) => {
      setBaseColor(color);
      onChange(color);
    };

    const handleGradientSelect = (gradientValue: string) => {
      const firstColor = gradientValue.match(/#[a-fA-F0-9]{6}/)?.[0];
      if (firstColor) {
        setBaseColor(firstColor);
      }
      onChange(gradientValue);
    };

    return (
      <div className="space-y-4">
        <div>
          <Label>Solid Color</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              className="w-[60px]"
              value={baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
            />
            <Input
              type="text"
              value={value?.startsWith("#") ? value : baseColor}
              onChange={(e) => handleBaseColorChange(e.target.value)}
              placeholder="#f97316"
              className="flex-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Generated Gradients</Label>
          <div className="grid grid-cols-2 gap-2">
            {generateGradients(baseColor).map((gradient) => (
              <Button
                key={gradient.name}
                variant="outline"
                className="relative h-16 w-full group overflow-hidden"
                style={{ background: gradient.value }}
                onClick={() => handleGradientSelect(gradient.value)}
              >
                <span className="sr-only">{gradient.name}</span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white text-xs font-medium">
                  {gradient.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Custom Gradient</Label>
          <Input
            type="text"
            value={value?.startsWith("linear-gradient") ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="linear-gradient(to right, #f97316, #ec4899)"
          />
          <p className="text-xs text-gray-500">
            Enter a CSS gradient value (e.g. linear-gradient(to right, #f97316,
            #ec4899))
          </p>
        </div>
      </div>
    );
  };

  const colorPickerContent = (
    <PopoverContent className="w-80">
      <ColorPicker
        value={step.panelBackgroundColor}
        onChange={(value) => onChange({ panelBackgroundColor: value })}
      />
    </PopoverContent>
  );

  const updatePanelContent = (updates: any) => {
    onChange({
      panelContent: {
        ...step.panelContent,
        ...updates,
      },
    });
  };

  const handlePanelTypeChange = (type: PanelType) => {
    const defaultContent = {
      main: {
        headline: "Train faster, cheaper models on production data",
        valueProps: [
          { icon: "Layers", text: "Train & deploy fine-tuned models" },
          { icon: "DollarSign", text: "Save time and money" },
          { icon: "Sparkles", text: "Get higher quality than OpenAI" },
        ],
        trustedByLogos: [],
      },
      "value-props": {
        headline: "Why use OpenPipe?",
        stats: [
          {
            value: "14x",
            label: "Cheaper than GPT-4 Turbo",
            icon: "ChevronDown",
          },
          {
            value: "5min",
            label: "To start collecting training data",
            icon: "ChevronRight",
          },
          {
            value: "$7M",
            label: "Saved by our customers this year",
            icon: "ChevronUp",
          },
        ],
      },
      testimonial: {
        headline: "What our users say",
        quote:
          "OpenPipe increased our inference speed by 3x compared to GPT4-turbo while reducing cost by >10x.",
        author: {
          name: "John Doe",
          title: "CEO & Co-founder",
          avatar: "",
        },
      },
      features: {
        headline: "Your AI Infrastructure Platform",
        features: [
          {
            title: "Data Collection & Processing",
            description:
              "Automatically collect and process your production data",
            icon: "Database",
          },
          {
            title: "Model Training & Fine-tuning",
            description: "Train custom models on your specific use cases",
            icon: "Cpu",
          },
          {
            title: "Automated Deployment",
            description: "Deploy models with zero-downtime updates",
            icon: "Rocket",
          },
        ],
      },
      success: {
        headline: "You're all set!",
        subheadline: "We'll reach out soon with next steps",
        features: [
          { title: "Access to dashboard", icon: "Layers" },
          { title: "Training data collection", icon: "Database" },
          { title: "Model deployment tools", icon: "Rocket" },
          { title: "Performance analytics", icon: "LineChart" },
        ],
      },
    };

    onChange({
      panelType: type,
      panelContent: defaultContent[type],
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Left Panel Configuration</h3>
          <p className="text-sm text-gray-600">
            Configure the content and visuals of the left panel. The left panel
            sets the tone and context for your signup experience.
          </p>
        </div>

        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps">Steps Editor</TabsTrigger>
            <TabsTrigger value="styles">Global Styles</TabsTrigger>
          </TabsList>

          <TabsContent value="styles" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="font-semibold">Panel Background Color</Label>
                <p className="text-sm text-gray-500">
                  Set a custom background color or gradient for all panels.
                  Individual steps can override this.
                </p>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          <span>
                            {step.panelBackgroundColor ||
                              "Select color or gradient"}
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    {colorPickerContent}
                  </Popover>
                </div>
              </div>
              {/* Add more global style options here */}
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Panel Type</Label>
                <p className="text-sm text-gray-500">
                  Choose the type of content displayed on the left panel (e.g.,
                  main overview, value props, testimonials).
                </p>
                <Select
                  value={step.panelType}
                  onValueChange={handlePanelTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a panel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main</SelectItem>
                    <SelectItem value="value-props">Value Props</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                    <SelectItem value="features">Features</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!step.inheritPreviousPanel}
                    onCheckedChange={(checked) =>
                      onChange({ inheritPreviousPanel: checked })
                    }
                    id="inheritPreviousPanel"
                  />
                  <Label
                    htmlFor="inheritPreviousPanel"
                    className="font-semibold"
                  >
                    Inherit Previous Panel
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  When enabled, this step will reuse the previous step's panel
                  content and style as a starting point.
                </p>
              </div>

              {!step.inheritPreviousPanel && (
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Panel Background Color (Override)
                  </Label>
                  <p className="text-sm text-gray-500">
                    Override the global background color for this specific step.
                  </p>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4" />
                            <span>
                              {step.panelBackgroundColor || "Use global color"}
                            </span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      {colorPickerContent}
                    </Popover>
                  </div>
                </div>
              )}

              {/* Existing panel type specific content */}
              {step.panelType === "main" && !step.inheritPreviousPanel && (
                <Card className="p-6 space-y-6 bg-white border">
                  <h4 className="text-base font-medium">Main Panel Content</h4>
                  <p className="text-sm text-gray-600">
                    The "Main" panel typically contains a headline, core value
                    props, and trusted logos. Keep it concise and impactful.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Headline</Label>
                      <Input
                        value={(step.panelContent as any).headline}
                        onChange={(e) =>
                          updatePanelContent({ headline: e.target.value })
                        }
                        placeholder="E.g. 'Train faster, cheaper models on production data'"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Label className="font-semibold">Value Props</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Highlight 2-4 key benefits that resonate with
                                your users. Keep them short and action-oriented.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const valueProps = [
                              ...((step.panelContent as any).valueProps || []),
                            ];
                            valueProps.push({ icon: "Star", text: "" });
                            updatePanelContent({ valueProps });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Value Prop
                        </Button>
                      </div>
                      {((step.panelContent as any).valueProps || []).length ===
                        0 && (
                        <p className="text-sm text-gray-500 italic">
                          No value props yet. Add some to highlight your unique
                          benefits.
                        </p>
                      )}
                      {((step.panelContent as any).valueProps || []).map(
                        (prop: any, index: number) => (
                          <Card key={index} className="p-4 space-y-4">
                            <div className="flex gap-4">
                              <div className="space-y-2 flex-1">
                                <Label>Icon Name</Label>
                                <Input
                                  value={prop.icon}
                                  onChange={(e) => {
                                    const valueProps = [
                                      ...(step.panelContent as any).valueProps,
                                    ];
                                    valueProps[index].icon = e.target.value;
                                    updatePanelContent({ valueProps });
                                  }}
                                  placeholder="E.g. Layers, DollarSign, Sparkles"
                                />
                                <p className="text-xs text-gray-500">
                                  Refer to Lucide icons for available names.
                                </p>
                              </div>
                              <div className="space-y-2 flex-1">
                                <Label>Text</Label>
                                <Input
                                  value={prop.text}
                                  onChange={(e) => {
                                    const valueProps = [
                                      ...(step.panelContent as any).valueProps,
                                    ];
                                    valueProps[index].text = e.target.value;
                                    updatePanelContent({ valueProps });
                                  }}
                                  placeholder="E.g. 'Train & deploy fine-tuned models'"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="self-end text-gray-500 hover:text-red-600"
                                onClick={() => {
                                  const valueProps = [
                                    ...(step.panelContent as any).valueProps,
                                  ];
                                  valueProps.splice(index, 1);
                                  updatePanelContent({ valueProps });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        )
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="font-semibold">Logo Display Mode</Label>
                      <p className="text-sm text-gray-500">
                        Choose how your trusted logos appear: a continuously
                        scrolling ticker or a static grid.
                      </p>
                      <Select
                        value={
                          (step.panelContent as any).logoDisplayMode || "ticker"
                        }
                        onValueChange={(val) =>
                          updatePanelContent({ logoDisplayMode: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Display Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ticker">
                            Ticker (Animated)
                          </SelectItem>
                          <SelectItem value="static">
                            Static (No Animation)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <TrustedLogos
                      logos={(step.panelContent as any).trustedByLogos || []}
                      onChange={(logos) =>
                        updatePanelContent({ trustedByLogos: logos })
                      }
                    />
                  </div>
                </Card>
              )}

              {step.panelType === "value-props" && (
                <Card className="p-6 space-y-6 bg-white border">
                  <h4 className="text-base font-medium">
                    Value Props Panel Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Highlight key statistics or metrics that showcase your
                    product's unique value.
                  </p>

                  <div className="space-y-2">
                    <Label className="font-semibold">Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent({ headline: e.target.value })
                      }
                      placeholder="E.g. 'Why use OpenPipe?'"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">Stats</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Use concise metrics that quickly communicate your
                              solution's benefits, like cost savings or time to
                              value.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const stats = [...(step.panelContent as any).stats];
                          stats.push({
                            value: "",
                            label: "",
                            icon: "ChevronRight",
                          });
                          updatePanelContent({ stats });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stat
                      </Button>
                    </div>
                    {(step.panelContent as any).stats?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No stats yet. Add some to highlight your benefits.
                      </p>
                    )}
                    {(step.panelContent as any).stats?.map(
                      (stat: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                            <div className="flex-1 space-y-2">
                              <Label>Value</Label>
                              <Input
                                value={stat.value}
                                onChange={(e) => {
                                  const stats = [
                                    ...(step.panelContent as any).stats,
                                  ];
                                  stats[index].value = e.target.value;
                                  updatePanelContent({ stats });
                                }}
                                placeholder="E.g. '14x'"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label>Label</Label>
                              <Input
                                value={stat.label}
                                onChange={(e) => {
                                  const stats = [
                                    ...(step.panelContent as any).stats,
                                  ];
                                  stats[index].label = e.target.value;
                                  updatePanelContent({ stats });
                                }}
                                placeholder="E.g. 'Cheaper than GPT-4 Turbo'"
                              />
                            </div>
                            <div className="w-full md:w-[150px] space-y-2">
                              <Label>Icon</Label>
                              <Select
                                value={stat.icon}
                                onValueChange={(value) => {
                                  const stats = [
                                    ...(step.panelContent as any).stats,
                                  ];
                                  stats[index].icon = value;
                                  updatePanelContent({ stats });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Icon" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ChevronDown">
                                    ChevronDown
                                  </SelectItem>
                                  <SelectItem value="ChevronRight">
                                    ChevronRight
                                  </SelectItem>
                                  <SelectItem value="ChevronUp">
                                    ChevronUp
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end md:items-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-red-600"
                                onClick={() => {
                                  const stats = [
                                    ...(step.panelContent as any).stats,
                                  ];
                                  stats.splice(index, 1);
                                  updatePanelContent({ stats });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                </Card>
              )}

              {step.panelType === "testimonial" && (
                <Card className="p-6 space-y-6 bg-white border">
                  <h4 className="text-base font-medium">
                    Testimonial Panel Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Show social proof by including a testimonial from a happy
                    user. Keep the quote short and authentic.
                  </p>

                  <div className="space-y-2">
                    <Label className="font-semibold">Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent({ headline: e.target.value })
                      }
                      placeholder="E.g. 'What our users say'"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Quote</Label>
                    <Input
                      value={(step.panelContent as any).quote}
                      onChange={(e) =>
                        updatePanelContent({ quote: e.target.value })
                      }
                      placeholder="E.g. 'Increased our inference speed by 3x...'"
                    />
                    <p className="text-sm text-gray-500">
                      Keep it concise and focused on specific, measurable
                      benefits.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Author Name</Label>
                    <Input
                      value={(step.panelContent as any).author?.name}
                      onChange={(e) =>
                        updatePanelContent({
                          author: {
                            ...(step.panelContent as any).author,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="E.g. 'John Doe'"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Author Title</Label>
                    <Input
                      value={(step.panelContent as any).author?.title}
                      onChange={(e) =>
                        updatePanelContent({
                          author: {
                            ...(step.panelContent as any).author,
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="E.g. 'CEO & Co-founder'"
                    />
                    <p className="text-sm text-gray-500">
                      Include both role and company for added credibility.
                    </p>
                  </div>
                </Card>
              )}

              {step.panelType === "features" && (
                <Card className="p-6 space-y-6 bg-white border">
                  <h4 className="text-base font-medium">
                    Features Panel Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Highlight key product features or capabilities. Use concise
                    titles and short descriptions.
                  </p>

                  <div className="space-y-2">
                    <Label className="font-semibold">Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent({ headline: e.target.value })
                      }
                      placeholder="E.g. 'Your AI Infrastructure Platform'"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">Features</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              List 3-4 core features that differentiate your
                              product. Each should have a clear benefit.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const features = [
                            ...(step.panelContent as any).features,
                          ];
                          features.push({
                            title: "",
                            description: "",
                            icon: "Star",
                          });
                          updatePanelContent({ features });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                    {(step.panelContent as any).features?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No features yet. Add some to showcase your product's
                        capabilities.
                      </p>
                    )}
                    {(step.panelContent as any).features?.map(
                      (feature: any, index: number) => (
                        <Card key={index} className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) => {
                                const features = [
                                  ...(step.panelContent as any).features,
                                ];
                                features[index].title = e.target.value;
                                updatePanelContent({ features });
                              }}
                              placeholder="E.g. 'Model Training & Fine-tuning'"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={feature.description}
                              onChange={(e) => {
                                const features = [
                                  ...(step.panelContent as any).features,
                                ];
                                features[index].description = e.target.value;
                                updatePanelContent({ features });
                              }}
                              placeholder="E.g. 'Train custom models on your specific use cases'"
                            />
                            <p className="text-sm text-gray-500">
                              Keep descriptions action-oriented and
                              benefit-focused.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Icon Name</Label>
                            <Input
                              value={feature.icon}
                              onChange={(e) => {
                                const features = [
                                  ...(step.panelContent as any).features,
                                ];
                                features[index].icon = e.target.value;
                                updatePanelContent({ features });
                              }}
                              placeholder="E.g. 'Database', 'Rocket'"
                            />
                            <p className="text-xs text-gray-500">
                              Refer to Lucide icons for available names.
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => {
                              const features = [
                                ...(step.panelContent as any).features,
                              ];
                              features.splice(index, 1);
                              updatePanelContent({ features });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      )
                    )}
                  </div>
                </Card>
              )}

              {step.panelType === "success" && (
                <Card className="p-6 space-y-6 bg-white border">
                  <h4 className="text-base font-medium">
                    Success Panel Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    This panel appears after submission. Reassure the user that
                    their information is received and highlight what's next.
                  </p>

                  <div className="space-y-2">
                    <Label className="font-semibold">Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent({ headline: e.target.value })
                      }
                      placeholder="E.g. 'You're all set!'"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Subheadline</Label>
                    <Input
                      value={(step.panelContent as any).subheadline}
                      onChange={(e) =>
                        updatePanelContent({ subheadline: e.target.value })
                      }
                      placeholder="E.g. 'We'll reach out soon with next steps'"
                    />
                    <p className="text-sm text-gray-500">
                      Set clear expectations about what happens next.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label className="font-semibold">Features</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              List what the user has unlocked or will get access
                              to. Keep it exciting but realistic.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const features = [
                            ...(step.panelContent as any).features,
                          ];
                          features.push({ title: "", icon: "Star" });
                          updatePanelContent({ features });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                    {(step.panelContent as any).features?.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No features yet. Add some to let the user know what
                        they've unlocked.
                      </p>
                    )}
                    {(step.panelContent as any).features?.map(
                      (feature: any, index: number) => (
                        <Card key={index} className="p-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={feature.title}
                              onChange={(e) => {
                                const features = [
                                  ...(step.panelContent as any).features,
                                ];
                                features[index].title = e.target.value;
                                updatePanelContent({ features });
                              }}
                              placeholder="E.g. 'Access to dashboard'"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Icon Name</Label>
                            <Input
                              value={feature.icon}
                              onChange={(e) => {
                                const features = [
                                  ...(step.panelContent as any).features,
                                ];
                                features[index].icon = e.target.value;
                                updatePanelContent({ features });
                              }}
                              placeholder="E.g. 'Layers', 'Database'"
                            />
                            <p className="text-xs text-gray-500">
                              Refer to Lucide icons for available names.
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-red-600"
                            onClick={() => {
                              const features = [
                                ...(step.panelContent as any).features,
                              ];
                              features.splice(index, 1);
                              updatePanelContent({ features });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      )
                    )}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}



### components/builder/branding-config.tsx

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



### components/builder/right-panel-builder.tsx

"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  type StepConfig,
  type FormField,
  type FormFieldType,
} from "@/lib/types";

interface RightPanelBuilderProps {
  step: StepConfig;
  onChange: (updates: Partial<StepConfig>) => void;
}

export function RightPanelBuilder({ step, onChange }: RightPanelBuilderProps) {
  const addField = () => {
    onChange({
      fields: [
        ...step.fields,
        {
          id: crypto.randomUUID(),
          label: "",
          type: "text",
          required: false,
          fullWidth: true,
        },
      ],
    });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...step.fields];
    newFields[index] = { ...newFields[index], ...updates };
    onChange({ fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = [...step.fields];
    newFields.splice(index, 1);
    onChange({ fields: newFields });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={step.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Input
          value={step.subheadline}
          onChange={(e) => onChange({ subheadline: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Form Fields</Label>
          <Button variant="outline" size="sm" onClick={addField}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {step.fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        updateField(index, { label: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 w-[200px]">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        updateField(index, { type: value as FormFieldType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="multi-select">
                          Multi Select
                        </SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="self-end text-gray-500 hover:text-red-600"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {(field.type === "select" || field.type === "multi-select") && (
                  <div className="space-y-2">
                    <Label>Options (one per line)</Label>
                    <Textarea
                      value={field.options?.join("\n")}
                      onChange={(e) =>
                        updateField(index, {
                          options: e.target.value.split("\n").filter(Boolean),
                        })
                      }
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) =>
                        updateField(index, { required: checked })
                      }
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.fullWidth}
                      onCheckedChange={(checked) =>
                        updateField(index, { fullWidth: checked })
                      }
                    />
                    <Label>Full Width</Label>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}



### components/builder/steps-builder.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import {
  type StepConfig,
  type FormField,
  type FormFieldType,
  type PanelType,
} from "@/lib/types";

interface StepsBuilderProps {
  steps: StepConfig[];
  onChange: (steps: StepConfig[]) => void;
}

export function StepsBuilder({ steps, onChange }: StepsBuilderProps) {
  const [activeStep, setActiveStep] = useState(0);

  const updateStep = (index: number, updates: Partial<StepConfig>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    onChange(newSteps);
  };

  const updatePanelContent = (
    index: number,
    panelType: PanelType,
    updates: any
  ) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      panelType,
      panelContent: {
        ...newSteps[index].panelContent,
        ...updates,
      },
    };
    onChange(newSteps);
  };

  const addField = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].fields.push({
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      required: false,
      fullWidth: true,
    });
    onChange(newSteps);
  };

  const updateField = (
    stepIndex: number,
    fieldIndex: number,
    updates: Partial<FormField>
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].fields[fieldIndex] = {
      ...newSteps[stepIndex].fields[fieldIndex],
      ...updates,
    };
    onChange(newSteps);
  };

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].fields.splice(fieldIndex, 1);
    onChange(newSteps);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeStep.toString()}
        onValueChange={(v) => setActiveStep(parseInt(v))}
      >
        <TabsList className="grid grid-cols-4">
          {steps.map((_, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              Step {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step, stepIndex) => (
          <TabsContent
            key={stepIndex}
            value={stepIndex.toString()}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Panel Type</Label>
                <Select
                  value={step.panelType}
                  onValueChange={(value: PanelType) =>
                    updateStep(stepIndex, { panelType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main</SelectItem>
                    <SelectItem value="value-props">Value Props</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {step.panelType === "main" && (
                <Card className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Panel Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "main", {
                          headline: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* Add value props editor here */}
                </Card>
              )}

              {step.panelType === "value-props" && (
                <Card className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Panel Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "value-props", {
                          headline: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* Add stats editor here */}
                </Card>
              )}

              {step.panelType === "testimonial" && (
                <Card className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Panel Headline</Label>
                    <Input
                      value={(step.panelContent as any).headline}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "testimonial", {
                          headline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={(step.panelContent as any).quote}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "testimonial", {
                          quote: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input
                      value={(step.panelContent as any).author?.name}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "testimonial", {
                          author: {
                            ...(step.panelContent as any).author,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Title</Label>
                    <Input
                      value={(step.panelContent as any).author?.title}
                      onChange={(e) =>
                        updatePanelContent(stepIndex, "testimonial", {
                          author: {
                            ...(step.panelContent as any).author,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                <Label>Form Headline</Label>
                <Input
                  value={step.headline}
                  onChange={(e) =>
                    updateStep(stepIndex, { headline: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Form Subheadline</Label>
                <Input
                  value={step.subheadline}
                  onChange={(e) =>
                    updateStep(stepIndex, { subheadline: e.target.value })
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Fields</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField(stepIndex)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-4">
                  {step.fields.map((field, fieldIndex) => (
                    <Card key={field.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="space-y-2 flex-1">
                            <Label>Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                updateField(stepIndex, fieldIndex, {
                                  label: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2 w-[200px]">
                            <Label>Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) =>
                                updateField(stepIndex, fieldIndex, {
                                  type: value as FormFieldType,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="multi-select">
                                  Multi Select
                                </SelectItem>
                                <SelectItem value="textarea">
                                  Textarea
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="self-end text-gray-500 hover:text-red-600"
                            onClick={() => removeField(stepIndex, fieldIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {(field.type === "select" ||
                          field.type === "multi-select") && (
                          <div className="space-y-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              value={field.options?.join("\n")}
                              onChange={(e) =>
                                updateField(stepIndex, fieldIndex, {
                                  options: e.target.value
                                    .split("\n")
                                    .filter(Boolean),
                                })
                              }
                              rows={4}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) =>
                                updateField(stepIndex, fieldIndex, {
                                  required: checked,
                                })
                              }
                            />
                            <Label>Required</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.fullWidth}
                              onCheckedChange={(checked) =>
                                updateField(stepIndex, fieldIndex, {
                                  fullWidth: checked,
                                })
                              }
                            />
                            <Label>Full Width</Label>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}



### components/builder/modal-builder.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Share2 } from "lucide-react";
import { StepBuilder } from "./step-builder";
import { BrandingConfig } from "./branding-config";
import { StyleConfig } from "./style-config";
import { type ModalConfig, type StepConfig, type Step } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

interface ModalBuilderProps {
  config: ModalConfig;
  onChange: (config: ModalConfig) => void;
  currentStep: Step;
  onStepChange: (step: Step) => void;
}

const defaultStep: StepConfig = {
  headline: "New Step",
  subheadline: "",
  panelType: "main",
  panelContent: {
    headline: "",
    valueProps: [],
    trustedByLogos: [],
  },
  fields: [],
};

export function ModalBuilder({
  config,
  onChange,
  currentStep,
  onStepChange,
}: ModalBuilderProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const addStep = () => {
    onChange({
      ...config,
      steps: [...config.steps, { ...defaultStep }],
    });
  };

  const removeStep = (index: number) => {
    const newSteps = [...config.steps];
    newSteps.splice(index, 1);
    onChange({ ...config, steps: newSteps });
    if (currentStep > newSteps.length) {
      onStepChange(newSteps.length as Step);
    }
  };

  const updateStep = (index: number, step: StepConfig) => {
    const newSteps = [...config.steps];
    newSteps[index] = step;
    onChange({ ...config, steps: newSteps });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch("/api/modal-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
          publish: true,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setEmbedUrl(data.data.embedUrl);
      toast.success("Successfully published modal!");
    } catch (error) {
      console.error("Error publishing modal:", error);
      toast.error("Failed to publish modal. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyEmbedCode = () => {
    if (!embedUrl) return;
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Modal Builder</h2>
        <div className="flex items-center gap-2">
          {embedUrl && (
            <Button variant="outline" onClick={copyEmbedCode}>
              Copy Embed Code
            </Button>
          )}
          <Button onClick={handlePublish} disabled={isPublishing}>
            <Share2 className="w-4 h-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {embedUrl && (
        <Card className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">
            Your modal is published! Use this URL to embed it:
          </p>
          <code className="text-sm bg-white p-2 rounded border block overflow-x-auto">
            {embedUrl}
          </code>
        </Card>
      )}

      <BrandingConfig config={config} onChange={onChange} />

      <StyleConfig config={config} onChange={onChange} />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Steps</h2>
        <Button onClick={addStep} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      <Tabs
        value={String(currentStep)}
        onValueChange={(value) => onStepChange(parseInt(value) as Step)}
        className="space-y-6"
      >
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <TabsList>
            {config.steps.map((_, index) => (
              <TabsTrigger key={index} value={String(index + 1)}>
                Step {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {config.steps.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeStep(currentStep - 1)}
              className="text-gray-500 hover:text-red-600 shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Current Step
            </Button>
          )}
        </div>

        {config.steps.map((step, index) => (
          <TabsContent key={index} value={String(index + 1)}>
            <Card className="p-6">
              <StepBuilder
                step={step}
                onChange={(updatedStep) => updateStep(index, updatedStep)}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}



### components/builder/step-builder.tsx

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeftPanelBuilder } from "./left-panel-builder"
import { RightPanelBuilder } from "./right-panel-builder"
import { type StepConfig } from "@/lib/types"

interface StepBuilderProps {
  step: StepConfig
  onChange: (step: StepConfig) => void
}

export function StepBuilder({ step, onChange }: StepBuilderProps) {
  return (
    <Tabs defaultValue="left" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="left">Left Panel</TabsTrigger>
        <TabsTrigger value="right">Right Panel</TabsTrigger>
      </TabsList>
      <TabsContent value="left" className="space-y-6">
        <LeftPanelBuilder
          step={step}
          onChange={(updates) => onChange({ ...step, ...updates })}
        />
      </TabsContent>
      <TabsContent value="right" className="space-y-6">
        <RightPanelBuilder
          step={step}
          onChange={(updates) => onChange({ ...step, ...updates })}
        />
      </TabsContent>
    </Tabs>
  )
}



## Components/Signup Directory

### components/signup/trusted-ticker.tsx

"use client";

import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { TrustedLogo } from "@/lib/types";

interface TrustedTickerProps {
  logos: TrustedLogo[];
  showFadeOverlays?: boolean;
  backgroundColor?: string;
}

const DEFAULT_IMAGE =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAAAHAABAAAAAAHYAAEAAAAAAAACCwAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEAYYHCAACBIIDBIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAAi9tZGF0EgAKBhgh//VMKjIQENAAAEABSBkszhFh/reTUBIACgk4If/1TCAhoNIy+wMQ0AGGFIFAACcnGo2Od9cUTxSM4gmv2Xt4hMK1Nsc9xtzr725oEymoe+XRqSx8GuDl8SG+3Rlrm1AVfRzIWZGcU6q+swM891K4NBA23u2iCmBY4izWam5dI9YXFGJ/S3z3lTCpZss5cz3Ce6rE3V9C+4oOYf/lp5019RKyo9CF0eUSR5+743YtZbrWY0Qh1H95orqCcHrvImaGq8pgkUVQgzTH8eTQxALSVdNhAOQlAQl1Hek/utG1E6Zpbcv4/nmoRko4R1t9n7FHO0AWbBsR2iSM1nw8NcIksF/TJ41KoXh5E1OAjTfX6XsuoUYSQdm0NhsXblCApJdVvJhq7gnlegPE87dnSERuYlNFGCltEzCo1VI3IGTuw67eB2WGoKbMgsKYbDuPJ6IzpXvWgnZRPZy/iJ5wuUR/DqtrhL0adIMmhHNUNpI1ZoXcThkHYFfKxd9n+o69zSSlv+kMZiveZdEwEvC0A6YuqJwZM8VIlCmad/LIWSG0dOMyBP2IlqTP/qRQK96gpY299zJ2C2h1+5mkVrCQQ6fRHrl53WCxYfNY81S5bthBEhvLIwHJ8P9nYMOc1FKhOFX7IAfRYk7AuWanyOpcND2HHjURP5qb5y/7YtXP53IGqxVY8GDjti7ApbbZ9bsKhCpUz0Bf7rc3Fx5+Jgx/Ph7CTXA=";

export function TrustedTicker({
  logos,
  showFadeOverlays = false,
  backgroundColor = "#f97316",
}: TrustedTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  // Only show fade overlays if it's a solid color
  const shouldShowFade =
    showFadeOverlays && !backgroundColor.includes("gradient");

  useEffect(() => {
    if (!containerRef.current) return;

    const startAnimation = async () => {
      const containerWidth = containerRef.current?.scrollWidth || 0;
      const singleSetWidth = containerWidth / 2;

      await controls.start({
        x: -singleSetWidth,
        transition: {
          duration: 10,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };

    startAnimation();
  }, [controls, logos]);

  if (logos.length === 0) return null;

  return (
    <div className="relative h-12 overflow-hidden">
      {shouldShowFade && (
        <>
          <div
            className="pointer-events-none absolute top-0 left-0 h-full w-24 z-10"
            style={{
              background: `linear-gradient(to right, ${backgroundColor}, ${backgroundColor}00)`,
            }}
          />
          <div
            className="pointer-events-none absolute top-0 right-0 h-full w-24 z-10"
            style={{
              background: `linear-gradient(to left, ${backgroundColor}, ${backgroundColor}00)`,
            }}
          />
        </>
      )}

      <motion.div
        ref={containerRef}
        className="flex items-center gap-8 absolute whitespace-nowrap"
        animate={controls}
        style={{ x: 0 }}
      >
        {/* First set */}
        <div className="flex items-center gap-8">
          {logos.map((logo) => (
            <div key={logo.id} className="relative w-32 h-8 shrink-0">
              <Image
                src={
                  logo.url?.startsWith("/")
                    ? DEFAULT_IMAGE
                    : logo.url || DEFAULT_IMAGE
                }
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center gap-8">
          {logos.map((logo) => (
            <div key={`${logo.id}-dup`} className="relative w-32 h-8 shrink-0">
              <Image
                src={
                  logo.url?.startsWith("/")
                    ? DEFAULT_IMAGE
                    : logo.url || DEFAULT_IMAGE
                }
                alt={logo.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}



### components/signup/left-panel-content.tsx

"use client";

import { motion } from "framer-motion";
import {
  Layers,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  Cpu,
  Rocket,
  LineChart,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { StepConfig, TrustedLogo } from "@/lib/types";
import { TrustedTicker } from "./trusted-ticker";
import Image from "next/image";

interface LeftPanelContentProps {
  step: StepConfig;
  backgroundColor?: string;
}

const icons: { [key: string]: any } = {
  Layers,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  Cpu,
  Rocket,
  LineChart,
  CheckCircle2,
  Zap,
};

export function LeftPanelContent({
  step,
  backgroundColor = "#f97316",
}: LeftPanelContentProps) {
  const content = step.panelContent || {};
  const logoDisplayMode = content?.logoDisplayMode || "ticker";

  if (step.panelType === "main") {
    return (
      <div className="space-y-8 w-full">
        <h2 className="text-4xl font-bold leading-tight text-white">
          {content.headline}
        </h2>
        <ul className="space-y-4 text-white">
          {content.valueProps?.map((prop: any, index: number) => {
            const Icon = icons[prop.icon];
            return (
              <li key={index} className="flex items-center gap-4 text-lg">
                {Icon && <Icon className="h-6 w-6 stroke-[1.5]" />}
                <span>{prop.text}</span>
              </li>
            );
          })}
        </ul>
        {content.trustedByLogos?.length > 0 && (
          <div className="pt-8 w-full">
            <p className="text-sm mb-3 text-white/80">
              Trusted by engineers at:
            </p>
            {logoDisplayMode === "ticker" ? (
              <TrustedTicker
                logos={content.trustedByLogos}
                showFadeOverlays={true}
                backgroundColor={step.panelBackgroundColor || backgroundColor}
              />
            ) : (
              <div className="flex items-center gap-6 text-white flex-wrap">
                {content.trustedByLogos.map((logo: TrustedLogo) => (
                  <div key={logo.id} className="relative w-32 h-8">
                    {logo.url ? (
                      <Image
                        src={logo.url}
                        alt={logo.alt}
                        fill
                        className="object-contain invert"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (step.panelType === "value-props") {
    return (
      <div className="space-y-8 w-full">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="space-y-4">
          {content.stats?.map((stat: any, index: number) => {
            const Icon = stat.icon ? icons[stat.icon] : null;
            return (
              <div key={index} className="bg-white/10 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-white/90 text-lg">{stat.label}</p>
                  </div>
                  {Icon && <Icon className="h-6 w-6 text-white/80" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.panelType === "testimonial") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="bg-white/10 p-6 rounded-xl">
          <p className="text-lg text-white mb-6">{content.quote}</p>
          <div className="flex items-center gap-4">
            {content.author?.avatar ? (
              <img
                src={content.author.avatar}
                alt={content.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20" />
            )}
            <div>
              <p className="font-bold text-white">{content.author?.name}</p>
              <p className="text-sm text-white/80">{content.author?.title}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step.panelType === "features") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="space-y-4">
          {content.features?.map((feature: any, index: number) => {
            const Icon = icons[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  {Icon && <Icon className="h-6 w-6 text-white/90 mt-1" />}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.panelType === "success") {
    return (
      <div className="space-y-8 max-w-md">
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {content.headline}
            </h2>
            <p className="text-white/80 text-lg">{content.subheadline}</p>
          </motion.div>
        </div>
        <div className="space-y-4">
          {content.features?.map((feature: any, index: number) => {
            const Icon = icons[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{feature.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}



### components/signup/form-steps.tsx

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, Step, StepConfig, FormField } from "@/lib/types";

interface FormStepsProps {
  step: Step;
  formData: FormData;
  setFormData: (data: FormData) => void;
  currentColor: string;
  config: StepConfig[];
}

export function FormSteps({
  step,
  formData,
  setFormData,
  currentColor,
  config,
}: FormStepsProps) {
  const currentStep = config[step - 1];

  if (!currentStep) return null;

  if (step === config.length) {
    // last step (success)
    return (
      <div className="flex-1 flex flex-col w-full">
        <div className="space-y-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col md:flex-row w-full"
          >
            <div className="flex-1 flex flex-col justify-between items-center text-center md:bg-transparent bg-white">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentStep.headline}
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  {currentStep.subheadline}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group fields into rows based on fullWidth
  const rows: FormField[][] = [];
  let currentRow: FormField[] = [];

  currentStep.fields.forEach((field) => {
    if (field.fullWidth) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      rows.push([field]);
    } else {
      currentRow.push(field);
      if (currentRow.length === 2) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      value: (formData as any)[field.id] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setFormData({ ...formData, [field.id]: e.target.value }),
      required: field.required,
      placeholder:
        field.type === "email" && field.id.toLowerCase().includes("email")
          ? "johndoe@example.com"
          : "",
    };

    const commonClasses =
      "h-12 w-full rounded-md border border-gray-300 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input {...commonProps} type={field.type} className={commonClasses} />
        );
      case "select":
        return (
          <Select
            value={(formData as any)[field.id] || ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [field.id]: value,
              })
            }
          >
            <SelectTrigger className={commonClasses}>
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
                className="text-base"
              />
            </SelectTrigger>
            <SelectContent className="rounded-md border-gray-300">
              {(field.options || []).map((option: string) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-base py-3 px-4 focus:bg-gray-100 cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            className="min-h-[120px] w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-black resize-none transition-colors duration-200"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      <h2 className="text-3xl font-bold text-gray-900">
        {currentStep.headline}
      </h2>
      <p className="text-gray-600 text-lg mb-6">{currentStep.subheadline}</p>
      <div className="space-y-6 flex-1">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4">
            {row.map((field) => (
              <div
                key={field.id}
                className={
                  field.fullWidth ? "w-full px-1" : "w-full md:w-1/2 px-1"
                }
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={field.id}
                    className="text-gray-700 font-medium"
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



### components/signup/modal-preview.tsx

"use client";

import { ModalContent } from "./modal-content";
import { ModalConfig } from "@/lib/types";

interface ModalPreviewProps {
  config: ModalConfig;
}

export function ModalPreview({ config }: ModalPreviewProps) {
  return (
    <div className="w-full h-full">
      <ModalContent config={config} />
    </div>
  );
}



### components/signup/modal-content.tsx

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalConfig, FormData, FormField } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { LeftPanelContent } from "./left-panel-content";

interface ModalContentProps {
  config: ModalConfig;
  onSubmit?: (formData: FormData) => void;
}

export function ModalContent({ config, onSubmit }: ModalContentProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isMobile, setIsMobile] = useState(false);

  const prevStepRef = useRef<number>(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const direction = step > prevStepRef.current ? 1 : -1;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width < 900);
      }
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const totalSteps = config.steps.length;
  const currentStepIndex = step - 1;
  const currentStep = config.steps[currentStepIndex];
  const progress = (step / totalSteps) * 100;

  // Compute effective step if inheritPreviousPanel is true
  const effectiveStep = useMemo(() => {
    if (currentStep?.inheritPreviousPanel && currentStepIndex > 0) {
      const prevStep = config.steps[currentStepIndex - 1];
      return {
        ...prevStep,
        ...currentStep,
        fields: currentStep.fields,
        inheritPreviousPanel: currentStep.inheritPreviousPanel,
        panelBackgroundColor:
          currentStep.panelBackgroundColor ?? prevStep.panelBackgroundColor,
      };
    }
    return currentStep;
  }, [config.steps, currentStep, currentStepIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      onSubmit?.(formData);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const leftVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const rightVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.id]: e.target.value })
              }
              required={field.required}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, [field.id]: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${field.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <textarea
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.id]: e.target.value })
              }
              required={field.required}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormFields = () => {
    if (!effectiveStep?.fields?.length) return null;

    return (
      <div className="grid grid-cols-2 gap-4">
        {effectiveStep.fields.map((field) => renderField(field))}
      </div>
    );
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 min-h-screen"
      style={{
        fontFamily: config.style?.fontFamily || "system-ui",
        color: config.style?.textColor || "#000000",
      }}
    >
      {/* Left Panel */}
      {!isMobile && (
        <div
          className="relative"
          style={{
            background:
              effectiveStep?.panelBackgroundColor ||
              config.style?.leftPanelColor ||
              "#f97316",
          }}
        >
          <div className="relative w-full h-full p-6 sm:p-12 overflow-y-auto">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step + "-left"}
                custom={direction}
                variants={leftVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full"
              >
                {effectiveStep && (
                  <LeftPanelContent
                    step={effectiveStep}
                    backgroundColor={
                      effectiveStep.panelBackgroundColor ||
                      config.style?.leftPanelColor
                    }
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className="relative min-h-screen"
        style={{
          backgroundColor: config.style?.rightPanelMainColor || "#FFFFFF",
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="px-6 sm:px-12 pt-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {step > 1 && (
                  <button
                    onClick={() => setStep((prev) => prev - 1)}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 -ml-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="h-2 flex-1 bg-gray-100 rounded-full">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: config.style?.primaryColor || "#f97316",
                    }}
                  />
                </div>
              </div>
              {/* Brand Header */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {config.branding?.logo ? (
                    <img
                      src={config.branding.logo}
                      alt={config.branding?.companyName || "Company Logo"}
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xl font-semibold">
                      {config.branding?.companyName || "OpenPipe"}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 w-full h-[1px] bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 relative overflow-y-auto">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step + "-right"}
                custom={direction}
                variants={rightVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 px-6 sm:px-12 pt-8 pb-8"
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col min-h-full"
                >
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {effectiveStep.headline}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {effectiveStep.subheadline}
                      </p>
                    </div>
                    <div className="pt-2">{renderFormFields()}</div>
                  </div>

                  <div className="flex justify-end pt-6 mt-auto">
                    <Button
                      type="submit"
                      className="rounded-full px-8 py-4 text-lg text-white hover:opacity-80 transition-opacity duration-200"
                      style={{
                        backgroundColor:
                          config.style?.primaryColor || "#f97316",
                      }}
                    >
                      {step === totalSteps ? "Submit" : "Continue"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}



### components/signup/client-form.tsx

"use client";

import { FormData, ModalConfig } from "@/lib/types";
import { ModalContent } from "./modal-content";

export function ClientForm({ config }: { config: ModalConfig }) {
  const handleSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);
    // Here you can implement the actual form submission logic
  };

  return <ModalContent config={config} onSubmit={handleSubmit} />;
}



### components/signup/signup-modal.tsx

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type FormData, type Step, type ModalConfig } from "@/lib/types";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { LeftPanelContent } from "./left-panel-content";
import { FormSteps } from "./form-steps";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ModalConfig;
  initialStep?: Step;
}

export function SignupModal({
  open,
  onOpenChange,
  config,
  initialStep = 1,
}: SignupModalProps) {
  const [step, setStep] = useState<Step>(initialStep);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  const totalSteps = config.steps.length;
  const currentStepIndex = step - 1;
  const currentStep = config.steps[currentStepIndex];

  // Compute effective step if inheritPreviousPanel is true
  const effectiveStep = useMemo(() => {
    if (currentStep?.inheritPreviousPanel && currentStepIndex > 0) {
      const prevStep = config.steps[currentStepIndex - 1];
      return {
        ...prevStep,
        ...currentStep,
        fields: currentStep.fields,
        inheritPreviousPanel: currentStep.inheritPreviousPanel,
        panelBackgroundColor:
          currentStep.panelBackgroundColor ?? prevStep.panelBackgroundColor,
      };
    }
    return currentStep;
  }, [config, currentStepIndex, currentStep]);

  const prevStepRef = useRef<Step>(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const direction = step > prevStepRef.current ? 1 : -1;

  const leftPanelPadding = config.style?.leftPanelPadding || "p-12";
  const leftPanelColor =
    effectiveStep?.panelBackgroundColor ??
    config.style?.leftPanelColor ??
    "#f97316";

  const rightPanelColor = config.style?.rightPanelMainColor || "#ffffff";

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      console.log(formData);
      onOpenChange(false);
    } else {
      handleNext();
    }
  };

  if (!open) return null;

  // Animations
  const leftVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      y: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const rightVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div
      className={`overflow-hidden rounded-lg border shadow-sm ${
        isMobile ? "max-w-[420px]" : "max-w-[1200px]"
      } mx-auto relative`}
      style={{ backgroundColor: rightPanelColor }}
    >
      <div className={`grid ${isMobile ? "" : "sm:grid-cols-2"} min-h-[600px]`}>
        {/* Left Panel */}
        {!isMobile && (
          <div
            className="relative rounded-l-lg overflow-hidden"
            style={{ background: leftPanelColor }}
          >
            <div className={`relative w-full h-full ${leftPanelPadding}`}>
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-left"}
                  custom={direction}
                  variants={leftVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full"
                >
                  {effectiveStep && <LeftPanelContent step={effectiveStep} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div className="relative rounded-r-lg overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className={`${isMobile ? "px-4" : "px-12"} pt-10`}>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 -ml-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div className="h-2 flex-1 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {/* Brand Header */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {config.branding?.logo ? (
                      <img
                        src={config.branding.logo}
                        alt={config.branding?.companyName || "Company Logo"}
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        {config.branding?.companyName || "OpenPipe"}
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 w-full h-[1px] bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-right"}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className={`h-full flex flex-col ${
                    isMobile ? "px-4" : "px-12"
                  } pt-8`}
                >
                  <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                  >
                    <div>
                      <FormSteps
                        step={step}
                        formData={formData}
                        setFormData={setFormData}
                        currentColor="#000000"
                        config={config.steps}
                      />
                    </div>

                    <div className="flex justify-end mt-8">
                      <Button
                        type="submit"
                        className="rounded-full px-8 py-4 text-lg bg-black text-white hover:opacity-80 transition-opacity duration-200"
                      >
                        {step === totalSteps ? "Submit" : "Continue"}
                      </Button>
                    </div>
                  </motion.form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-4 right-4 flex items-center gap-2 p-1.5 bg-white rounded-lg shadow-md border">
        <Button
          variant={isMobile ? "ghost" : "secondary"}
          size="sm"
          onClick={() => setIsMobile(false)}
          className="rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={isMobile ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsMobile(true)}
          className="rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}



### components/signup/trusted-example.tsx

import { TrustedTicker } from "./trusted-ticker";
import { placeholderLogos } from "@/lib/placeholder-logos";

export function TrustedExample() {
  return (
    <div className="bg-[#f97316] p-8">
      <TrustedTicker logos={placeholderLogos} showFadeOverlays={true} />
    </div>
  );
}




## Lib Directory

### lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function isBase64Image(str: string) {
  return str.startsWith("data:image/");
}



### lib/types.ts

export type FormFieldType =
  | "text"
  | "email"
  | "select"
  | "multi-select"
  | "textarea";
// lib/types.ts
export type TrustedLogo = {
  id: string;
  url: string;
  alt: string;
};

export type PanelType =
  | "main"
  | "value-props"
  | "testimonial"
  | "features"
  | "success";

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  fullWidth: boolean;
  options?: string[];
}

export interface Author {
  name: string;
  title: string;
  avatar?: string;
}

export interface PanelContentMain {
  headline: string;
  valueProps: { icon: string; text: string }[];
  trustedByLogos: TrustedLogo[];
}

export interface PanelContentValueProps {
  headline: string;
  stats: { value: string; label: string; icon?: string }[];
}

export interface PanelContentTestimonial {
  headline: string;
  quote: string;
  author: Author;
}

export interface PanelContentFeatures {
  headline: string;
  features: { title: string; description: string; icon: string }[];
}

export interface PanelContentSuccess {
  headline: string;
  subheadline: string;
  features: { title: string; icon: string }[];
}

export type PanelContent =
  | PanelContentMain
  | PanelContentValueProps
  | PanelContentTestimonial
  | PanelContentFeatures
  | PanelContentSuccess
  | Record<string, any>;

export interface StepConfig {
  headline: string;
  subheadline?: string;
  panelType: PanelType;
  panelContent?: any;
  fields: FormField[];
  inheritPreviousPanel?: boolean;
  panelBackgroundColor?: string;
  // Add display mode for logos
  // If omitted, default to ticker or static as you prefer
  // We'll store it in panelContent for simplicity:
  // panelContent: { ..., logoDisplayMode?: "ticker" | "static" }
}

export interface ModalConfig {
  headline: string;
  valueProps: { icon: string; text: string }[];
  logo: string;
  trustedByLogos: TrustedLogo[];
  steps: StepConfig[];
  style?: {
    leftPanelPadding?: string;
    leftPanelColor?: string;
    rightPanelMainColor?: string;
    // Global styles
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  };
  branding?: {
    logo?: string;
    companyName?: string;
  };
}

export type FormData = Record<string, string>;
export type Step = number;



### lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Database = {
  public: {
    Tables: {
      modal_configs: {
        Row: {
          id: string;
          created_at: string;
          config: any;
          published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          config: any;
          published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          config?: any;
          published?: boolean;
        };
      };
    };
  };
};



### lib/placeholder-logos.ts

import { TrustedLogo } from "./types";

// Base64 encoded transparent 1x1 pixel PNG
const transparentPixel =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAAAHAABAAAAAAHYAAEAAAAAAAACCwAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEAYYHCAACBIIDBIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAAi9tZGF0EgAKBhgh//VMKjIQENAAAEABSBkszhFh/reTUBIACgk4If/1TCAhoNIy+wMQ0AGGFIFAACcnGo2Od9cUTxSM4gmv2Xt4hMK1Nsc9xtzr725oEymoe+XRqSx8GuDl8SG+3Rlrm1AVfRzIWZGcU6q+swM891K4NBA23u2iCmBY4izWam5dI9YXFGJ/S3z3lTCpZss5cz3Ce6rE3V9C+4oOYf/lp5019RKyo9CF0eUSR5+743YtZbrWY0Qh1H95orqCcHrvImaGq8pgkUVQgzTH8eTQxALSVdNhAOQlAQl1Hek/utG1E6Zpbcv4/nmoRko4R1t9n7FHO0AWbBsR2iSM1nw8NcIksF/TJ41KoXh5E1OAjTfX6XsuoUYSQdm0NhsXblCApJdVvJhq7gnlegPE87dnSERuYlNFGCltEzCo1VI3IGTuw67eB2WGoKbMgsKYbDuPJ6IzpXvWgnZRPZy/iJ5wuUR/DqtrhL0adIMmhHNUNpI1ZoXcThkHYFfKxd9n+o69zSSlv+kMZiveZdEwEvC0A6YuqJwZM8VIlCmad/LIWSG0dOMyBP2IlqTP/qRQK96gpY299zJ2C2h1+5mkVrCQQ6fRHrl53WCxYfNY81S5bthBEhvLIwHJ8P9nYMOc1FKhOFX7IAfRYk7AuWanyOpcND2HHjURP5qb5y/7YtXP53IGqxVY8GDjti7ApbbZ9bsKhCpUz0Bf7rc3Fx5+Jgx/Ph7CTXA=";

export const placeholderLogos: TrustedLogo[] = [
  {
    id: "placeholder-1",
    url: transparentPixel,
    alt: "Trusted Company 1",
  },
  {
    id: "placeholder-2",
    url: transparentPixel,
    alt: "Trusted Company 2",
  },
  {
    id: "placeholder-3",
    url: transparentPixel,
    alt: "Trusted Company 3",
  },
];



