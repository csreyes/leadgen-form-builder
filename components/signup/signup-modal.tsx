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
            className="relative rounded-l-lg overflow-hidden"
            style={{ background: leftPanelColor }}
          >
            <div className={`relative w-full h-full ${leftPanelPadding}`}>
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

        {/* Right Panel */}
        <div className="relative rounded-r-lg overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="px-12 pt-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button
                      onClick={handleBack}
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
                    {config.branding?.logo ? (
                      <img
                        src={config.branding.logo}
                        alt={config.branding?.companyName || "Company Logo"}
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">
                        {config.branding?.companyName || "OpenPipe"}
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5 w-full h-[1px] bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence custom={direction} mode="sync">
                <motion.div
                  key={step + "-right"}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full flex flex-col px-12 pt-8"
                >
                  <motion.form
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                  >
                    <div>
                      <FormSteps
                        step={step}
                        formData={formData}
                        setFormData={setFormData}
                        currentColor="#000000"
                        config={config.steps}
                      />
                    </div>

                    <div className="flex justify-end mt-8">
                      <Button
                        type="submit"
                        className="rounded-full px-8 py-4 text-lg bg-black text-white hover:opacity-80 transition-opacity duration-200"
                      >
                        {step === totalSteps ? "Submit" : "Continue"}
                      </Button>
                    </div>
                  </motion.form>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
