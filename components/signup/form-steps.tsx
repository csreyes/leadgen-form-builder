"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, Step, StepConfig, FormField } from "@/lib/types";

interface FormStepsProps {
  step: Step;
  formData: FormData;
  setFormData: (data: FormData) => void;
  currentColor: string;
  config: StepConfig[];
}

export function FormSteps({
  step,
  formData,
  setFormData,
  currentColor,
  config,
}: FormStepsProps) {
  const currentStep = config[step - 1];

  if (!currentStep) return null;

  if (step === config.length) {
    // last step (success)
    return (
      <div className="flex-1 flex flex-col w-full">
        <div className="space-y-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col md:flex-row w-full"
          >
            <div className="flex-1 flex flex-col justify-between items-center text-center md:bg-transparent bg-white">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentStep.headline}
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  {currentStep.subheadline}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group fields into rows based on fullWidth
  const rows: FormField[][] = [];
  let currentRow: FormField[] = [];

  currentStep.fields.forEach((field) => {
    if (field.fullWidth) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      rows.push([field]);
    } else {
      currentRow.push(field);
      if (currentRow.length === 2) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      value: (formData as any)[field.id] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setFormData({ ...formData, [field.id]: e.target.value }),
      required: field.required,
      placeholder:
        field.type === "email" && field.id.toLowerCase().includes("email")
          ? "johndoe@example.com"
          : "",
    };

    const commonClasses =
      "h-12 w-full rounded-md border border-gray-300 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200";

    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input {...commonProps} type={field.type} className={commonClasses} />
        );
      case "select":
        return (
          <Select
            value={(formData as any)[field.id] || ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [field.id]: value,
              })
            }
          >
            <SelectTrigger className={commonClasses}>
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
                className="text-base"
              />
            </SelectTrigger>
            <SelectContent className="rounded-md border-gray-300">
              {(field.options || []).map((option: string) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="text-base py-3 px-4 focus:bg-gray-100 cursor-pointer"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            className="min-h-[120px] w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-black focus:border-black resize-none transition-colors duration-200"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      <h2 className="text-3xl font-bold text-gray-900">
        {currentStep.headline}
      </h2>
      <p className="text-gray-600 text-lg mb-6">{currentStep.subheadline}</p>
      <div className="space-y-6 flex-1">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-4">
            {row.map((field) => (
              <div
                key={field.id}
                className={
                  field.fullWidth ? "w-full px-1" : "w-full md:w-1/2 px-1"
                }
              >
                <div className="space-y-2">
                  <Label
                    htmlFor={field.id}
                    className="text-gray-700 font-medium"
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
