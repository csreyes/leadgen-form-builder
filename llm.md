# Project Files Content

## App Directory

### app/layout.tsx

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenPipe - Train Faster, Cheaper Models',
  description: 'OpenPipe helps you fine-tune and deploy models that are faster and cheaper than GPT-4, trained on your production data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}


### app/page.tsx

"use client";

import { useState } from "react";
import { SignupModal } from "@/components/signup/signup-modal";
import { ModalBuilder } from "@/components/builder/modal-builder";
import { ModalConfig, StepConfig, Step, TrustedLogo } from "@/lib/types";

// Example trusted logos as objects with url/alt:
const sampleLogos: TrustedLogo[] = [
  { id: "logo1", url: "/logo1.png", alt: "Company 1" },
  { id: "logo2", url: "/logo2.png", alt: "Company 2" },
];

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
      avatar: "",
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




## Components/Builder Directory

### components/builder/image-upload.tsx

"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  label: string
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxFiles: 1
  })

  return (
    <div className="space-y-4">
      {value ? (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="relative w-32 h-12">
              <Image
                src={value}
                alt={label}
                fill
                className="object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange("")}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card 
          {...getRootProps()}
          className={`p-8 border-dashed cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div className="text-gray-600">
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Drag and drop an image here, or click to select</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
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



### components/builder/left-panel-builder.tsx

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
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { type StepConfig, type PanelType } from "@/lib/types";
import { TrustedLogos } from "./trusted-logos";
import { Switch } from "@/components/ui/switch";

interface LeftPanelBuilderProps {
  step: StepConfig;
  onChange: (updates: Partial<StepConfig>) => void;
}

export function LeftPanelBuilder({ step, onChange }: LeftPanelBuilderProps) {
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Panel Type</Label>
        <Select value={step.panelType} onValueChange={handlePanelTypeChange}>
          <SelectTrigger>
            <SelectValue />
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

      <div className="flex items-center gap-2">
        <Switch
          checked={!!step.inheritPreviousPanel}
          onCheckedChange={(checked) =>
            onChange({ inheritPreviousPanel: checked })
          }
        />
        <Label>Inherit Previous Panel</Label>
      </div>

      {!step.inheritPreviousPanel && (
        <div className="space-y-2">
          <Label>Panel Background Color</Label>
          <Input
            type="text"
            value={step.panelBackgroundColor || ""}
            onChange={(e) => onChange({ panelBackgroundColor: e.target.value })}
            placeholder="#f97316"
          />
          <p className="text-sm text-gray-500">
            Enter a valid CSS color (e.g. #f97316, rgb(249,115,22), etc.)
          </p>
        </div>
      )}

      {step.panelType === "main" && !step.inheritPreviousPanel && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Value Props</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const valueProps = [...(step.panelContent as any).valueProps];
                  valueProps.push({ icon: "Star", text: "" });
                  updatePanelContent({ valueProps });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Value Prop
              </Button>
            </div>
            {(step.panelContent as any).valueProps?.map(
              (prop: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Icon</Label>
                      <Input
                        value={prop.icon}
                        onChange={(e) => {
                          const valueProps = [
                            ...(step.panelContent as any).valueProps,
                          ];
                          valueProps[index].icon = e.target.value;
                          updatePanelContent({ valueProps });
                        }}
                      />
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
          <TrustedLogos
            logos={(step.panelContent as any).trustedByLogos || []}
            onChange={(logos) => updatePanelContent({ trustedByLogos: logos })}
          />
        </Card>
      )}

      {step.panelType === "value-props" && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Stats</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const stats = [...(step.panelContent as any).stats];
                  stats.push({ value: "", label: "", icon: "ChevronRight" });
                  updatePanelContent({ stats });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stat
              </Button>
            </div>
            {(step.panelContent as any).stats?.map(
              (stat: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="space-y-2 flex-1">
                        <Label>Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const stats = [...(step.panelContent as any).stats];
                            stats[index].value = e.target.value;
                            updatePanelContent({ stats });
                          }}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const stats = [...(step.panelContent as any).stats];
                            stats[index].label = e.target.value;
                            updatePanelContent({ stats });
                          }}
                        />
                      </div>
                      <div className="space-y-2 w-[150px]">
                        <Label>Icon</Label>
                        <Select
                          value={stat.icon}
                          onValueChange={(value) => {
                            const stats = [...(step.panelContent as any).stats];
                            stats[index].icon = value;
                            updatePanelContent({ stats });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ChevronDown">Down</SelectItem>
                            <SelectItem value="ChevronRight">Right</SelectItem>
                            <SelectItem value="ChevronUp">Up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="self-end text-gray-500 hover:text-red-600"
                        onClick={() => {
                          const stats = [...(step.panelContent as any).stats];
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
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Quote</Label>
            <Input
              value={(step.panelContent as any).quote}
              onChange={(e) => updatePanelContent({ quote: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Author Name</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label>Author Title</Label>
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
            />
          </div>
        </Card>
      )}

      {step.panelType === "features" && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Features</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const features = [...(step.panelContent as any).features];
                  features.push({ title: "", description: "", icon: "Star" });
                  updatePanelContent({ features });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={feature.icon}
                      onChange={(e) => {
                        const features = [
                          ...(step.panelContent as any).features,
                        ];
                        features[index].icon = e.target.value;
                        updatePanelContent({ features });
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => {
                      const features = [...(step.panelContent as any).features];
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
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Subheadline</Label>
            <Input
              value={(step.panelContent as any).subheadline}
              onChange={(e) =>
                updatePanelContent({ subheadline: e.target.value })
              }
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Features</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const features = [...(step.panelContent as any).features];
                  features.push({ title: "", icon: "Star" });
                  updatePanelContent({ features });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Input
                      value={feature.icon}
                      onChange={(e) => {
                        const features = [
                          ...(step.panelContent as any).features,
                        ];
                        features[index].icon = e.target.value;
                        updatePanelContent({ features });
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-600"
                    onClick={() => {
                      const features = [...(step.panelContent as any).features];
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
  );
}



### components/builder/right-panel-builder.tsx

"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { type StepConfig, type FormField } from "@/lib/types"

interface RightPanelBuilderProps {
  step: StepConfig
  onChange: (updates: Partial<StepConfig>) => void
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
          fullWidth: true
        }
      ]
    })
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...step.fields]
    newFields[index] = { ...newFields[index], ...updates }
    onChange({ fields: newFields })
  }

  const removeField = (index: number) => {
    const newFields = [...step.fields]
    newFields.splice(index, 1)
    onChange({ fields: newFields })
  }

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
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
          >
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
                      onChange={(e) => updateField(index, { label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 w-[200px]">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="multi-select">Multi Select</SelectItem>
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
                      onChange={(e) => updateField(index, {
                        options: e.target.value.split("\n").filter(Boolean)
                      })}
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(index, { required: checked })}
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.fullWidth}
                      onCheckedChange={(checked) => updateField(index, { fullWidth: checked })}
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
  )
}


### components/builder/steps-builder.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { StepConfig, FormField, PanelType } from "@/lib/types"

interface StepsBuilderProps {
  steps: StepConfig[]
  onChange: (steps: StepConfig[]) => void
}

export function StepsBuilder({ steps, onChange }: StepsBuilderProps) {
  const [activeStep, setActiveStep] = useState(0)

  const updateStep = (index: number, updates: Partial<StepConfig>) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], ...updates }
    onChange(newSteps)
  }

  const updatePanelContent = (index: number, panelType: PanelType, updates: any) => {
    const newSteps = [...steps]
    newSteps[index] = { 
      ...newSteps[index], 
      panelType,
      panelContent: {
        ...newSteps[index].panelContent,
        ...updates
      }
    }
    onChange(newSteps)
  }

  const addField = (stepIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].fields.push({
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      required: false,
      fullWidth: true,
    })
    onChange(newSteps)
  }

  const updateField = (stepIndex: number, fieldIndex: number, updates: Partial<FormField>) => {
    const newSteps = [...steps]
    newSteps[stepIndex].fields[fieldIndex] = {
      ...newSteps[stepIndex].fields[fieldIndex],
      ...updates,
    }
    onChange(newSteps)
  }

  const removeField = (stepIndex: number, fieldIndex: number) => {
    const newSteps = [...steps]
    newSteps[stepIndex].fields.splice(fieldIndex, 1)
    onChange(newSteps)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeStep.toString()} onValueChange={(v) => setActiveStep(parseInt(v))}>
        <TabsList className="grid grid-cols-4">
          {steps.map((_, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              Step {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step, stepIndex) => (
          <TabsContent key={stepIndex} value={stepIndex.toString()} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Panel Type</Label>
                <Select
                  value={step.panelType}
                  onValueChange={(value: PanelType) => updateStep(stepIndex, { panelType: value })}
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
                      onChange={(e) => updatePanelContent(stepIndex, "main", { headline: e.target.value })}
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
                      onChange={(e) => updatePanelContent(stepIndex, "value-props", { headline: e.target.value })}
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
                      onChange={(e) => updatePanelContent(stepIndex, "testimonial", { headline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={(step.panelContent as any).quote}
                      onChange={(e) => updatePanelContent(stepIndex, "testimonial", { quote: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input
                      value={(step.panelContent as any).author?.name}
                      onChange={(e) => updatePanelContent(stepIndex, "testimonial", { 
                        author: {
                          ...(step.panelContent as any).author,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Title</Label>
                    <Input
                      value={(step.panelContent as any).author?.title}
                      onChange={(e) => updatePanelContent(stepIndex, "testimonial", { 
                        author: {
                          ...(step.panelContent as any).author,
                          title: e.target.value
                        }
                      })}
                    />
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                <Label>Form Headline</Label>
                <Input
                  value={step.headline}
                  onChange={(e) => updateStep(stepIndex, { headline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Form Subheadline</Label>
                <Input
                  value={step.subheadline}
                  onChange={(e) => updateStep(stepIndex, { subheadline: e.target.value })}
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
                              onChange={(e) => updateField(stepIndex, fieldIndex, { label: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 w-[200px]">
                            <Label>Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) => updateField(stepIndex, fieldIndex, { type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="multi-select">Multi Select</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
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

                        {(field.type === "select" || field.type === "multi-select") && (
                          <div className="space-y-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              value={field.options?.join("\n")}
                              onChange={(e) => updateField(stepIndex, fieldIndex, {
                                options: e.target.value.split("\n").filter(Boolean)
                              })}
                              rows={4}
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(stepIndex, fieldIndex, { required: checked })}
                            />
                            <Label>Required</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.fullWidth}
                              onCheckedChange={(checked) => updateField(stepIndex, fieldIndex, { fullWidth: checked })}
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
  )
}


### components/builder/modal-builder.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { StepBuilder } from "./step-builder";
import { type ModalConfig, type StepConfig, type Step } from "@/lib/types";

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

  return (
    <div className="space-y-6">
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

import { motion } from "framer-motion";
import Image from "next/image";
import { TrustedLogo } from "@/lib/types";

interface TrustedTickerProps {
  logos: TrustedLogo[];
}

export function TrustedTicker({ logos }: TrustedTickerProps) {
  if (logos.length === 0) return null;

  return (
    <div className="relative h-12 overflow-hidden">
      {/* Fade overlays */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10" />

      <motion.div
        className="flex items-center gap-8 absolute whitespace-nowrap"
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {logos.map((logo) => (
              <div key={logo.id} className="relative w-32 h-8 shrink-0">
                {/* Use next/image or standard img tag */}
                {logo.url ? (
                  <Image
                    src={logo.url}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full" />
                )}
              </div>
            ))}
          </div>
        ))}
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

interface LeftPanelContentProps {
  step: StepConfig;
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

export function LeftPanelContent({ step }: LeftPanelContentProps) {
  const content = step.panelContent as any;

  if (step.panelType === "main") {
    return (
      <div className="space-y-8 max-w-md">
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
          <div className="pt-8">
            <p className="text-sm mb-3 text-white/80">
              Trusted by engineers at:
            </p>
            <div className="flex items-center gap-6 text-white">
              {content.trustedByLogos.map((logo: TrustedLogo) => (
                <img
                  key={logo.id}
                  src={logo.url}
                  alt={logo.alt}
                  className="h-6 object-contain"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step.panelType === "value-props") {
    return (
      <div className="space-y-8 max-w-md">
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, Step, StepConfig, FormField } from "@/lib/types";
import { motion } from "framer-motion";

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
              <button
                onClick={() => window.close()}
                className="rounded-full px-8 py-4 text-lg font-semibold bg-black text-white hover:bg-black/90 transition-colors duration-200"
              >
                Close Modal
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group fields into rows
  const rows: FormField[][] = [];
  let currentRow: FormField[] = [];

  (currentStep.fields || []).forEach((field) => {
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
      className:
        "rounded-full border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200",
      placeholder:
        field.type === "email" && field.id.toLowerCase().includes("email")
          ? "johndoe@example.com"
          : "",
    };

    switch (field.type) {
      case "text":
      case "email":
        return <Input {...commonProps} type={field.type} />;
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
            <SelectTrigger className="w-full rounded-full border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option: string) => (
                <SelectItem key={option} value={option}>
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
            className="min-h-[120px] rounded-full border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-black resize-none transition-colors duration-200"
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
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.map((field) => (
              <div
                key={field.id}
                className={
                  field.fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"
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
      className={`rounded-lg border shadow-sm ${
        isMobile ? "max-w-[420px]" : "max-w-[1200px]"
      } mx-auto relative`}
      style={{ backgroundColor: rightPanelColor }}
    >
      <div className={`grid ${isMobile ? "" : "sm:grid-cols-2"} min-h-[600px]`}>
        {/* Left Panel */}
        {!isMobile && (
          <div
            className={`relative ${leftPanelPadding}`}
            style={{ backgroundColor: leftPanelColor }}
          >
            <div className="relative w-full h-full overflow-hidden">
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

        {/* Right Panel with overflow-auto */}
        <div className="p-10 flex flex-col rounded-r-lg relative overflow-auto">
          <div className="space-y-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {step > 1 && (
                  <motion.button
                    key={step + "-backbtn"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
              <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#000000" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            </div>
            {/* Brand Header */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">
                  OpenPipe
                </span>
              </div>
              <div className="mt-2 w-full h-[2px] bg-gray-100"></div>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 flex-1 flex flex-col relative"
          >
            <div className="relative flex-1 overflow-auto">
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-right"}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4 flex-1 flex flex-col"
                >
                  <FormSteps
                    step={step}
                    formData={formData}
                    setFormData={setFormData}
                    currentColor="#000000"
                    config={config.steps}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {step < totalSteps && (
              <div className="flex justify-end pt-4 mt-auto">
                <Button
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg bg-black text-white hover:bg-black/90 transition-colors duration-200"
                >
                  Continue
                </Button>
              </div>
            )}
            {step === totalSteps && (
              <div className="flex justify-end pt-4 mt-auto">
                <Button
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg bg-black text-white hover:bg-black/90 transition-colors duration-200"
                >
                  Submit
                </Button>
              </div>
            )}
          </motion.form>
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



