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
