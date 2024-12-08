// components/signup/modal-content.tsx

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { ModalConfig, FormData, FormField } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { LeftPanelContent } from "./left-panel-content";

interface ModalContentProps {
  config: ModalConfig;
  onSubmit?: (formData: FormData) => void;
}

export function ModalContent({ config, onSubmit }: ModalContentProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isMobile, setIsMobile] = useState(false);

  // Track if we're on the very first render so we can skip initial animation
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    setInitialRender(false);
  }, []);

  const prevStepRef = useRef<number>(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const direction = step > prevStepRef.current ? 1 : -1;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width < 900);
      }
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

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
  }, [config.steps, currentStep, currentStepIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      onSubmit?.(formData);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const leftVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      y: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const rightVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      position: "absolute" as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      position: "absolute" as const,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const progress = (step / totalSteps) * 100;

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.id]: e.target.value })
              }
              required={field.required}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, [field.id]: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${field.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-2" : ""}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <textarea
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.id]: e.target.value })
              }
              required={field.required}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderFormFields = () => {
    if (!effectiveStep?.fields?.length) return null;
    return (
      <div className="grid grid-cols-2 gap-4">
        {effectiveStep.fields.map((field) => renderField(field))}
      </div>
    );
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 min-h-screen"
      style={{
        fontFamily: config.style?.fontFamily || "system-ui",
        color: config.style?.textColor || "#000000",
      }}
    >
      {/* Left Panel */}
      {!isMobile && (
        <div
          className="relative"
          style={{
            background:
              effectiveStep?.panelBackgroundColor ||
              config.style?.leftPanelColor ||
              "#f97316",
          }}
        >
          <div className="relative w-full h-full p-6 sm:p-12 overflow-y-auto">
            {/* On the very first render (first load), we skip AnimatePresence for the left panel */}
            {initialRender && step === 1 ? (
              <div className="w-full h-full">
                {effectiveStep && (
                  <LeftPanelContent
                    step={effectiveStep}
                    backgroundColor={
                      effectiveStep.panelBackgroundColor ||
                      config.style?.leftPanelColor
                    }
                  />
                )}
              </div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step + "-left"}
                  custom={direction}
                  variants={leftVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full"
                >
                  {effectiveStep && (
                    <LeftPanelContent
                      step={effectiveStep}
                      backgroundColor={
                        effectiveStep.panelBackgroundColor ||
                        config.style?.leftPanelColor
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className="relative min-h-screen"
        style={{
          backgroundColor: config.style?.rightPanelMainColor || "#FFFFFF",
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="px-6 sm:px-12 pt-10">
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
                    className="h-full rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: config.style?.primaryColor || "#f97316",
                    }}
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
                    <span className="text-xl font-semibold">
                      {config.branding?.companyName || "OpenPipe"}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 w-full h-[1px] bg-gray-200"></div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 relative overflow-y-auto">
            {/* On the very first render and first step, skip initial animation on the right panel too */}
            {initialRender && step === 1 ? (
              <div className="absolute inset-0 px-6 sm:px-12 pt-8 pb-8">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col min-h-full"
                >
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {effectiveStep.headline}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {effectiveStep.subheadline}
                      </p>
                    </div>
                    <div className="pt-2">{renderFormFields()}</div>
                  </div>

                  <div className="flex justify-end pt-6 mt-auto">
                    <Button
                      type="submit"
                      className="rounded-full px-8 py-4 text-lg text-white hover:opacity-80 transition-opacity duration-200"
                      style={{
                        backgroundColor:
                          config.style?.primaryColor || "#f97316",
                      }}
                    >
                      {step === totalSteps ? "Submit" : "Continue"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step + "-right"}
                  custom={direction}
                  variants={rightVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 px-6 sm:px-12 pt-8 pb-8"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col min-h-full"
                  >
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-2xl font-semibold">
                          {effectiveStep.headline}
                        </h2>
                        <p className="text-gray-600 mt-2">
                          {effectiveStep.subheadline}
                        </p>
                      </div>
                      <div className="pt-2">{renderFormFields()}</div>
                    </div>

                    <div className="flex justify-end pt-6 mt-auto">
                      <Button
                        type="submit"
                        className="rounded-full px-8 py-4 text-lg text-white hover:opacity-80 transition-opacity duration-200"
                        style={{
                          backgroundColor:
                            config.style?.primaryColor || "#f97316",
                        }}
                      >
                        {step === totalSteps ? "Submit" : "Continue"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
