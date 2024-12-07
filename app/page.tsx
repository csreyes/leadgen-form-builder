"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignupModal } from "@/components/signup/signup-modal";
import { ModalBuilder } from "@/components/builder/modal-builder";
import { ModalConfig } from "@/lib/types";

const defaultConfig: ModalConfig = {
  headline: "Train faster, cheaper models on production data",
  valueProps: [
    { icon: "Layers", text: "Train & deploy fine-tuned models" },
    { icon: "DollarSign", text: "Save time and money" },
    { icon: "Sparkles", text: "Get higher quality than OpenAI" },
  ],
  logo: "",
  trustedByLogos: [],
  steps: [
    {
      headline: "Let's get started",
      subheadline:
        "Please answer a few questions so we can create your account.",
      panelType: "main",
      panelContent: {
        headline: "Train faster, cheaper models on production data",
        valueProps: [
          { icon: "Layers", text: "Train & deploy fine-tuned models" },
          { icon: "DollarSign", text: "Save time and money" },
          { icon: "Sparkles", text: "Get higher quality than OpenAI" },
        ],
        trustedByLogos: [],
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
      headline: "Which model(s) do you currently use in production?",
      subheadline: "You can select multiple options.",
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
          id: "models",
          label: "Models",
          type: "multi-select",
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
      panelContent: {
        headline: "What our users say",
        quote:
          "OpenPipe increased our inference speed by 3x compared to GPT4-turbo while reducing cost by >10x. It's a no-brainer for any company that uses LLMs in prod.",
        author: {
          name: "David Paffenholz",
          title: "CEO & Co-founder • Juicebox",
        },
      },
      fields: [
        {
          id: "calls",
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
      headline: "Almost done!",
      subheadline: "Just a few more details to help us serve you better.",
      panelType: "main",
      panelContent: {
        headline: "Your datasets, models and evaluations in one place.",
        valueProps: [
          { icon: "Layers", text: "Capture Data" },
          { icon: "DollarSign", text: "Train Models" },
          { icon: "Sparkles", text: "Automatic Deployment" },
        ],
        trustedByLogos: [],
      },
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
  ],
};

export default function Home() {
  const [config, setConfig] = useState<ModalConfig>(defaultConfig);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        {/* Left side - Builder */}
        <div className="w-1/2 overflow-auto p-8 border-r">
          <h1 className="text-3xl font-bold mb-8">Signup Modal Builder</h1>
          <ModalBuilder config={config} onChange={setConfig} />
        </div>

        {/* Right side - Preview */}
        <div className="w-1/2 bg-black/80 flex items-center justify-center overflow-auto">
          <SignupModal open={true} onOpenChange={() => {}} config={config} />
        </div>
      </div>
    </div>
  );
}
