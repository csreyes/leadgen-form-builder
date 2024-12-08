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
