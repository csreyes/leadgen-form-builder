"use client";

import { useState, useEffect } from "react";
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
import { placeholderLogos } from "@/lib/placeholder-logos";
import { ModalConfig, PanelType, FormData } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { LeftPanelContent } from "@/components/signup/left-panel-content";

const defaultConfig: ModalConfig = {
  headline: "Train faster, cheaper models on production data",
  valueProps: [
    { icon: "Layers", text: "Train & deploy fine-tuned models" },
    { icon: "DollarSign", text: "Save time and money" },
    { icon: "Sparkles", text: "Get higher quality than OpenAI" },
  ],
  logo: "",
  trustedByLogos: placeholderLogos,
  branding: {
    companyName: "OpenPipe",
  },
  steps: [
    {
      headline: "Let's get started",
      subheadline:
        "Please answer a few questions so we can create your account.",
      panelType: "main" as PanelType,
      panelContent: {
        headline: "Train faster, cheaper models on production data",
        valueProps: [
          { icon: "Layers", text: "Train & deploy fine-tuned models" },
          { icon: "DollarSign", text: "Save time and money" },
          { icon: "Sparkles", text: "Get higher quality than OpenAI" },
        ],
        trustedByLogos: placeholderLogos,
      },
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
      headline: "Which model(s) do you currently use?",
      subheadline: "This helps us understand your needs better.",
      panelType: "value-props" as PanelType,
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
          label: "Current Models",
          type: "select",
          required: true,
          fullWidth: true,
          options: ["GPT-4", "GPT-3.5", "Claude", "Mixtral", "Gemini", "Other"],
        },
      ],
    },
  ],
  style: {
    leftPanelColor: "#f97316",
    rightPanelMainColor: "#ffffff",
  },
};

export default function TestIframe() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width < 640);
      }
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const totalSteps = defaultConfig.steps.length;
  const currentStepIndex = step - 1;
  const currentStep = defaultConfig.steps[currentStepIndex];
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      console.log(formData);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const renderFormFields = () => {
    if (currentStepIndex === 0) {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
        </div>
      );
    } else if (currentStepIndex === 1) {
      return (
        <div>
          <Label htmlFor="currentModels">Current Models</Label>
          <Select
            value={formData.currentModels || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, currentModels: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select the models you use" />
            </SelectTrigger>
            <SelectContent>
              {currentStep.fields[0].options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen">
      {/* Left Panel */}
      {(!isMobile || step === 1) && (
        <div
          className="relative"
          style={{ backgroundColor: defaultConfig.style?.leftPanelColor }}
        >
          <div className="relative w-full h-full p-12">
            {currentStep && <LeftPanelContent step={currentStep} />}
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className="relative"
        style={{ backgroundColor: defaultConfig.style?.rightPanelMainColor }}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="px-12 pt-10">
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
                    className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {/* Brand Header */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {defaultConfig.branding?.logo ? (
                    <img
                      src={defaultConfig.branding.logo}
                      alt={
                        defaultConfig.branding?.companyName || "Company Logo"
                      }
                      className="h-8 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-gray-900">
                      {defaultConfig.branding?.companyName || "OpenPipe"}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 w-full h-[1px] bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 px-12 pt-8">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 space-y-6">
                  <h2 className="text-2xl font-semibold">
                    {currentStep.headline}
                  </h2>
                  <p className="text-gray-600">{currentStep.subheadline}</p>
                  {renderFormFields()}
                </div>

                <div className="flex justify-end pt-6 mt-auto">
                  <Button
                    type="submit"
                    className="rounded-full px-8 py-4 text-lg bg-black text-white hover:opacity-80 transition-opacity duration-200"
                  >
                    {step === totalSteps ? "Submit" : "Continue"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
