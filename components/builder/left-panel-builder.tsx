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
import { Plus, Trash2, Info } from "lucide-react";
import { type StepConfig, type PanelType } from "@/lib/types";
import { TrustedLogos } from "./trusted-logos";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Left Panel Configuration</h3>
          <p className="text-sm text-gray-600">
            Configure the content and visuals of the left panel. The left panel
            sets the tone and context for your signup experience.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Panel Type</Label>
            <p className="text-sm text-gray-500">
              Choose the type of content displayed on the left panel (e.g., main
              overview, value props, testimonials).
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
              <Label htmlFor="inheritPreviousPanel" className="font-semibold">
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
              <Label className="font-semibold">Panel Background Color</Label>
              <p className="text-sm text-gray-500">
                Set a custom background color or gradient for this panel.
              </p>
              <Input
                type="text"
                value={step.panelBackgroundColor || ""}
                onChange={(e) =>
                  onChange({ panelBackgroundColor: e.target.value })
                }
                placeholder="#f97316 or linear-gradient(...)"
              />
            </div>
          )}
        </div>

        {step.panelType === "main" && !step.inheritPreviousPanel && (
          <Card className="p-6 space-y-6 bg-white border">
            <h4 className="text-base font-medium">Main Panel Content</h4>
            <p className="text-sm text-gray-600">
              The "Main" panel typically contains a headline, core value props,
              and trusted logos. Keep it concise and impactful.
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
                          Highlight 2-4 key benefits that resonate with your
                          users. Keep them short and action-oriented.
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
                {((step.panelContent as any).valueProps || []).length === 0 && (
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
                  Choose how your trusted logos appear: a continuously scrolling
                  ticker or a static grid.
                </p>
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
            <h4 className="text-base font-medium">Value Props Panel Content</h4>
            <p className="text-sm text-gray-600">
              Highlight key statistics or metrics that showcase your product's
              unique value.
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
                        solution's benefits, like cost savings or time to value.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                            const stats = [...(step.panelContent as any).stats];
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
                            const stats = [...(step.panelContent as any).stats];
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
                            const stats = [...(step.panelContent as any).stats];
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
                            <SelectItem value="ChevronUp">ChevronUp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end md:items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-600"
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
          <Card className="p-6 space-y-6 bg-white border">
            <h4 className="text-base font-medium">Testimonial Panel Content</h4>
            <p className="text-sm text-gray-600">
              Show social proof by including a testimonial from a happy user.
              Keep the quote short and authentic.
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
                onChange={(e) => updatePanelContent({ quote: e.target.value })}
                placeholder="E.g. 'Increased our inference speed by 3x...'"
              />
              <p className="text-sm text-gray-500">
                Keep it concise and focused on specific, measurable benefits.
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
            <h4 className="text-base font-medium">Features Panel Content</h4>
            <p className="text-sm text-gray-600">
              Highlight key product features or capabilities. Use concise titles
              and short descriptions.
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
                        List 3-4 core features that differentiate your product.
                        Each should have a clear benefit.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
                        Keep descriptions action-oriented and benefit-focused.
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
            <h4 className="text-base font-medium">Success Panel Content</h4>
            <p className="text-sm text-gray-600">
              This panel appears after submission. Reassure the user that their
              information is received and highlight what's next.
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
                        List what the user has unlocked or will get access to.
                        Keep it exciting but realistic.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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
              {(step.panelContent as any).features?.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No features yet. Add some to let the user know what they've
                  unlocked.
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
    </TooltipProvider>
  );
}
