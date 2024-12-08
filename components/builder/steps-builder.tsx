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
