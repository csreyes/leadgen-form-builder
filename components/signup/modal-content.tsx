"use client";

import { useState, useEffect, useRef } from "react";
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
import { ModalConfig, FormData } from "@/lib/types";
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

  const prevStepRef = useRef<number>(step);
  useEffect(() => {
    prevStepRef.current = step;
  }, [step]);
  const direction = step > prevStepRef.current ? 1 : -1;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsMobile(entry.contentRect.width < 640);
      }
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const totalSteps = config.steps.length;
  const currentStepIndex = step - 1;
  const currentStep = config.steps[currentStepIndex];
  const progress = (step / totalSteps) * 100;

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
    }),
    center: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
  };

  const rightVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    }),
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
    <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
      {/* Left Panel */}
      {(!isMobile || step === 1) && (
        <div
          className="relative"
          style={{
            background:
              typeof config.style?.leftPanelColor === "string" &&
              config.style.leftPanelColor.includes("gradient")
                ? config.style.leftPanelColor
                : config.style?.leftPanelColor,
          }}
        >
          <div className="relative w-full h-full p-12">
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
                {currentStep && <LeftPanelContent step={currentStep} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className="relative"
        style={{ backgroundColor: config.style?.rightPanelMainColor }}
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
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={step + "-right"}
                custom={direction}
                variants={rightVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 px-12 pt-8 pb-8 flex flex-col"
              >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {currentStep.headline}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {currentStep.subheadline}
                      </p>
                    </div>
                    <div className="pt-2">{renderFormFields()}</div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      className="rounded-full px-8 py-4 text-lg bg-black text-white hover:opacity-80 transition-opacity duration-200"
                    >
                      {step === totalSteps ? "Submit" : "Continue"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
