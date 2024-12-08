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
