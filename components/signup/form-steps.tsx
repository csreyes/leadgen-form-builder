"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, Step, StepConfig, FormField } from "@/lib/types";
import { motion } from "framer-motion";

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

  if (step === 5) {
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
              <Button
                onClick={() => window.close()}
                variant="default"
                size="lg"
                className="rounded-full mb-8"
              >
                Close Modal
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Group fields into rows based on fullWidth property
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
    const commonInputProps = {
      id: field.id,
      value: (formData as any)[field.id] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setFormData({ ...formData, [field.id]: e.target.value }),
      required: field.required,
      className:
        "rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0",
      style: {
        "--tw-ring-color": currentColor,
        "--tw-ring-opacity": "0.2",
        borderColor: (formData as any)[field.id] ? currentColor : undefined,
      } as any,
    };

    switch (field.type) {
      case "text":
        return <Input {...commonInputProps} />;
      case "email":
        return <Input {...commonInputProps} type="email" />;
      case "select":
      case "multi-select":
        return (
          <Select
            value={(formData as any)[field.id]}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [field.id]: field.type === "multi-select" ? [value] : value,
              })
            }
          >
            <SelectTrigger className="w-full rounded-full">
              <SelectValue
                placeholder={`Select ${field.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...commonInputProps}
            className="min-h-[120px] rounded-2xl border-gray-200 bg-white focus:ring-2 focus:ring-offset-0 resize-none"
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
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {row.map((field) => (
              <div
                key={field.id}
                className={
                  field.fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"
                }
              >
                <div className="space-y-2">
                  <Label htmlFor={field.id} className="text-gray-700">
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
