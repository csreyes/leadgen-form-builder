"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type FormData, type SignupModalProps, type Step } from "@/lib/types";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { LeftPanelContent } from "./left-panel-content";
import { FormSteps } from "./form-steps";

const STEPS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-20%" : "20%",
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? "-20%" : "20%",
    opacity: 0,
  }),
};

const transition = {
  y: { type: "tween", duration: 0.3, ease: "easeInOut" },
  opacity: { duration: 0.3 },
};

const colors = {
  orange: "#f97316",
  purple: "#9333ea",
};

const defaultConfig = {
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
      fields: [],
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
      fields: [],
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
      fields: [],
    },
    {
      headline: "Anything else?",
      subheadline: "",
      panelType: "features",
      panelContent: {
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
      fields: [],
    },
    {
      headline: "Thanks!",
      subheadline: "We'll be in touch shortly.",
      panelType: "success",
      panelContent: {
        headline: "You're all set!",
        subheadline: "We'll reach out soon with next steps",
        features: [
          { title: "Access to dashboard", icon: "Layers" },
          { title: "Training data collection", icon: "Database" },
          { title: "Model deployment tools", icon: "Rocket" },
          { title: "Performance analytics", icon: "LineChart" },
        ],
      },
      fields: [],
    },
  ],
};

export function SignupModal({
  open,
  onOpenChange,
  config = defaultConfig,
}: SignupModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    currentModels: [],
    dailyCalls: "",
    source: "",
    comments: "",
  });

  const progress = (step / STEPS) * 100;
  const currentColor = step % 2 === 0 ? colors.purple : colors.orange;
  const currentStep = config.steps[step - 1];

  const handleNext = () => {
    if (step < STEPS) {
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
    if (step === STEPS - 1) {
      console.log(formData);
      handleNext();
    } else {
      handleNext();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`overflow-hidden rounded-lg border shadow-sm ${
        isMobile ? "max-w-[420px]" : "max-w-[1200px]"
      } mx-auto relative`}
    >
      <div className={`grid ${isMobile ? "" : "sm:grid-cols-2"} min-h-[600px]`}>
        <div
          className="relative overflow-hidden transition-colors duration-300 ease-in-out"
          style={{ backgroundColor: currentColor }}
        >
          <AnimatePresence custom={step} mode="popLayout" initial={false}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0 p-16"
            >
              {currentStep && <LeftPanelContent step={currentStep} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="p-10 bg-white overflow-hidden">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {step > 1 && step < STEPS && (
                  <motion.button
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
                  style={{ backgroundColor: currentColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-xl font-semibold">OpenPipe</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <FormSteps
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  currentColor={currentColor}
                />
              </motion.div>
            </AnimatePresence>
            {step < STEPS && (
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg"
                  style={{
                    backgroundColor: currentColor,
                    color: "white",
                  }}
                >
                  {step === STEPS - 1 ? "Submit" : "Continue"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="fixed top-4 right-4 flex items-center gap-2 p-1.5 bg-white rounded-lg shadow-md border">
        <Button
          variant={isMobile ? "ghost" : "secondary"}
          size="sm"
          onClick={() => setIsMobile(false)}
          className="rounded-md"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={isMobile ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsMobile(true)}
          className="rounded-md"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
