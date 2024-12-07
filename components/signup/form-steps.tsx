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
import { FormData, Step } from "@/lib/types";
import { motion } from "framer-motion";

interface FormStepsProps {
  step: Step;
  formData: FormData;
  setFormData: (data: FormData) => void;
  currentColor: string;
}

export function FormSteps({
  step,
  formData,
  setFormData,
  currentColor,
}: FormStepsProps) {
  if (step === 5) {
    return (
      <div className="flex-1 flex flex-col w-full">
        <div className="space-y-6 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col md:flex-row w-full"
          >
            <div className="hidden md:flex flex-1 bg-[#F26B3A] rounded-lg p-8 flex-col text-white mr-8">
              <h2 className="text-3xl font-bold mb-8">
                Your datasets, models and evaluations in one place.
              </h2>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-full px-6 py-3">
                  Capture Data
                </div>
                <div className="bg-white/10 rounded-full px-6 py-3">
                  Train Models
                </div>
                <div className="bg-white/10 rounded-full px-6 py-3">
                  Automatic Deployment
                </div>
                <div className="bg-white/10 rounded-full px-6 py-3">
                  Evaluate & Compare
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between items-center text-center md:bg-transparent bg-white">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Thanks!
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  We'll be in touch shortly.
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

  return (
    <div className="flex-1 flex flex-col w-full">
      <h2 className="text-3xl font-bold text-gray-900">
        {step === 1
          ? "Let's get started"
          : step === 2
          ? "Which model(s) do you currently use in production?"
          : step === 3
          ? "About how many LLM calls does your project make per day?"
          : "Anything else?"}
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        {step === 1
          ? "Please answer a few questions so we can create your account."
          : step === 2
          ? "You can select multiple options."
          : step === 4
          ? "How did you hear about us?"
          : ""}
      </p>
      <div className="space-y-6 flex-1">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Work Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0 w-full"
                style={
                  {
                    "--tw-ring-color": currentColor,
                    "--tw-ring-opacity": "0.2",
                    borderColor: formData.email ? currentColor : undefined,
                  } as any
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0"
                  style={
                    {
                      "--tw-ring-color": currentColor,
                      "--tw-ring-opacity": "0.2",
                      borderColor: formData.firstName
                        ? currentColor
                        : undefined,
                    } as any
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0"
                  style={
                    {
                      "--tw-ring-color": currentColor,
                      "--tw-ring-opacity": "0.2",
                      borderColor: formData.lastName ? currentColor : undefined,
                    } as any
                  }
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-2 flex-1">
            <Label htmlFor="currentModels" className="text-gray-700">
              Models <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.currentModels[0]}
              onValueChange={(value) =>
                setFormData({ ...formData, currentModels: [value] })
              }
            >
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Select models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt4">GPT-4</SelectItem>
                <SelectItem value="gpt35">GPT-3.5</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="mixtral">Mixtral</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 flex-1">
            <Label htmlFor="dailyCalls" className="text-gray-700">
              Daily Calls <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.dailyCalls}
              onValueChange={(value) =>
                setFormData({ ...formData, dailyCalls: value })
              }
            >
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<1000">&lt; 1,000</SelectItem>
                <SelectItem value="1k-10k">1,000 to 10,000</SelectItem>
                <SelectItem value="10k-50k">10,000 to 50,000</SelectItem>
                <SelectItem value="50k-100k">50,000 to 100,000</SelectItem>
                <SelectItem value=">100k">&gt; 100,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-gray-700">
                How did you hear about us?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value })
                }
              >
                <SelectTrigger className="w-full rounded-full">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="friend">Friend or colleague</SelectItem>
                  <SelectItem value="search">Search engine</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments" className="text-gray-700">
                Any additional comments or questions?
              </Label>
              <Textarea
                id="comments"
                placeholder="Share your thoughts..."
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                className="min-h-[120px] rounded-2xl border-gray-200 bg-white focus:ring-2 focus:ring-offset-0 resize-none"
                style={
                  {
                    "--tw-ring-color": currentColor,
                    "--tw-ring-opacity": "0.2",
                    borderColor: formData.comments ? currentColor : undefined,
                  } as any
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
