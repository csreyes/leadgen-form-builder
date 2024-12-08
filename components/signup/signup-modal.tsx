"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type FormData, type Step, type ModalConfig } from "@/lib/types";
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
      fields: [],
    },
  ],
};

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: ModalConfig;
  initialStep?: Step;
}

export function SignupModal({
  open,
  onOpenChange,
  config = defaultConfig,
  initialStep = 1,
}: SignupModalProps) {
  const [step, setStep] = useState<Step>(initialStep);
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

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

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
        {!isMobile && (
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
        )}
        <div className="p-10 bg-white overflow-hidden flex flex-col">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {step > 1 && (
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
              <div
                className={`h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden ${
                  !isMobile ? "min-w-[482px]" : "min-w-[300px]"
                }`}
              >
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
          <form onSubmit={handleSubmit} className="mt-8 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <FormSteps
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  currentColor={currentColor}
                  config={config.steps}
                />
              </motion.div>
            </AnimatePresence>
            {step < STEPS && (
              <div className="flex justify-end pt-4 mt-auto">
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
