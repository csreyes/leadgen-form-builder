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
            {((step.panelContent as any).valueProps || []).map(
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

          {/* Add a toggle for Ticker vs Static */}
          <div className="space-y-2">
            <Label>Logo Display Mode</Label>
            <Select
              value={(step.panelContent as any).logoDisplayMode || "ticker"}
              onValueChange={(val) =>
                updatePanelContent({ logoDisplayMode: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Display Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ticker">Ticker (Animated)</SelectItem>
                <SelectItem value="static">Static (No Animation)</SelectItem>
              </SelectContent>
            </Select>
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
