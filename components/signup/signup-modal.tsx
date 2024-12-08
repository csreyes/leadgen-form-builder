"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type FormData, type Step, type ModalConfig } from "@/lib/types";
import { ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { LeftPanelContent } from "./left-panel-content";
import { FormSteps } from "./form-steps";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ModalConfig;
  initialStep?: Step;
}

export function SignupModal({
  open,
  onOpenChange,
  config,
  initialStep = 1,
}: SignupModalProps) {
  const [step, setStep] = useState<Step>(initialStep);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<FormData>({});

  const totalSteps = config.steps.length;
  const currentStepIndex = step - 1;
  const currentStep = config.steps[currentStepIndex];

  // Compute effective step if inheritPreviousPanel is true
  const effectiveStep = useMemo(() => {
    if (currentStep?.inheritPreviousPanel && currentStepIndex > 0) {
      const prevStep = config.steps[currentStepIndex - 1];
      return {
        ...prevStep,
        ...currentStep,
        fields: currentStep.fields,
        inheritPreviousPanel: currentStep.inheritPreviousPanel,
        panelBackgroundColor:
          currentStep.panelBackgroundColor ?? prevStep.panelBackgroundColor,
      };
    }
    return currentStep;
  }, [config, currentStepIndex, currentStep]);

  const prevStepRef = useRef<Step>(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const direction = step > prevStepRef.current ? 1 : -1;

  const leftPanelPadding = config.style?.leftPanelPadding || "p-12";
  const leftPanelColor =
    effectiveStep?.panelBackgroundColor ??
    config.style?.leftPanelColor ??
    "#f97316";

  const rightPanelColor = config.style?.rightPanelMainColor || "#ffffff";

  const handleNext = () => {
    if (step < totalSteps) {
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
    if (step === totalSteps) {
      console.log(formData);
      onOpenChange(false);
    } else {
      handleNext();
    }
  };

  if (!open) return null;

  // Animations
  const leftVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      y: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const rightVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div
      className={`overflow-hidden rounded-lg border shadow-sm ${
        isMobile ? "max-w-[420px]" : "max-w-[1200px]"
      } mx-auto relative`}
      style={{ backgroundColor: rightPanelColor }}
    >
      <div className={`grid ${isMobile ? "" : "sm:grid-cols-2"} min-h-[600px]`}>
        {/* Left Panel */}
        {!isMobile && (
          <div
            className={`relative ${leftPanelPadding} rounded-l-lg`}
            style={{ backgroundColor: leftPanelColor }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-left"}
                  custom={direction}
                  variants={leftVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full"
                >
                  {effectiveStep && <LeftPanelContent step={effectiveStep} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Right Panel with overflow-auto */}
        <div className="p-10 flex flex-col rounded-r-lg relative overflow-auto">
          <div className="space-y-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {step > 1 && (
                  <motion.button
                    key={step + "-backbtn"}
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
                  style={{ backgroundColor: "#000000" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            </div>
            {/* Brand Header */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-gray-900">
                  OpenPipe
                </span>
              </div>
              <div className="mt-2 w-full h-[2px] bg-gray-100"></div>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 flex-1 flex flex-col relative"
          >
            <div className="relative flex-1 overflow-auto">
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-right"}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4 flex-1 flex flex-col"
                >
                  <FormSteps
                    step={step}
                    formData={formData}
                    setFormData={setFormData}
                    currentColor="#000000"
                    config={config.steps}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {step < totalSteps && (
              <div className="flex justify-end pt-4 mt-auto">
                <Button
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg bg-black text-white hover:bg-black/90 transition-colors duration-200"
                >
                  Continue
                </Button>
              </div>
            )}
            {step === totalSteps && (
              <div className="flex justify-end pt-4 mt-auto">
                <Button
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg bg-black text-white hover:bg-black/90 transition-colors duration-200"
                >
                  Submit
                </Button>
              </div>
            )}
          </motion.form>
        </div>
      </div>
      <div className="fixed top-4 right-4 flex items-center gap-2 p-1.5 bg-white rounded-lg shadow-md border">
        <Button
          variant={isMobile ? "ghost" : "secondary"}
          size="sm"
          onClick={() => setIsMobile(false)}
          className="rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={isMobile ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsMobile(true)}
          className="rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
