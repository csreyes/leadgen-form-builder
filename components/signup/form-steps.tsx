"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormData, Step } from "@/lib/types"

interface FormStepsProps {
  step: Step
  formData: FormData
  setFormData: (data: FormData) => void
  currentColor: string
}

export function FormSteps({ step, formData, setFormData, currentColor }: FormStepsProps) {
  if (step === 1) {
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900">Let's get started</h2>
        <p className="text-gray-600 text-lg">
          Please answer a few questions so we can create your account.
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Work Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0"
              style={{
                "--tw-ring-color": currentColor,
                "--tw-ring-opacity": "0.2",
                borderColor: formData.email ? currentColor : undefined
              } as any}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">First Name <span className="text-red-500">*</span></Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }
                required
                className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0"
                style={{
                  "--tw-ring-color": currentColor,
                  "--tw-ring-opacity": "0.2",
                  borderColor: formData.firstName ? currentColor : undefined
                } as any}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700">Last Name <span className="text-red-500">*</span></Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }
                required
                className="rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-offset-0"
                style={{
                  "--tw-ring-color": currentColor,
                  "--tw-ring-opacity": "0.2",
                  borderColor: formData.lastName ? currentColor : undefined
                } as any}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (step === 2) {
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900">
          Which model(s) do you currently use in production?
        </h2>
        <p className="text-gray-600 text-lg">
          You can select multiple options.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            "GPT-4",
            "GPT-3.5",
            "Claude",
            "Mixtral",
            "Gemini",
            "Other",
          ].map((model) => (
            <Button
              key={model}
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  ...formData,
                  currentModels: formData.currentModels.includes(model)
                    ? formData.currentModels.filter((m) => m !== model)
                    : [...formData.currentModels, model],
                })
              }
              className={`justify-start rounded-full h-12 text-lg ${
                formData.currentModels.includes(model)
                  ? "bg-gray-100 border-gray-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {model}
            </Button>
          ))}
        </div>
      </>
    )
  }

  if (step === 3) {
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900">
          About how many LLM calls does your project make per day?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            "< 1,000",
            "1,000 to 10,000",
            "10,000 to 50,000",
            "50,000 to 100,000",
            "> 100,000",
          ].map((range) => (
            <Button
              key={range}
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({ ...formData, dailyCalls: range })
              }
              className={`justify-start rounded-full h-12 text-lg ${
                formData.dailyCalls === range
                  ? "bg-gray-100 border-gray-200"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              {range}
            </Button>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900">
        What is the most important goal you hope to achieve through fine-tuning?
      </h2>
      <p className="text-gray-600 text-lg">
        You can select multiple options.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {[
          "Lower cost",
          "Lower latency",
          "Higher response quality",
          "Other",
        ].map((goal) => (
          <Button
            key={goal}
            type="button"
            variant="outline"
            onClick={() => {}}
            className="justify-start rounded-full h-12 text-lg bg-white hover:bg-gray-50"
            style={{
              backgroundColor: goal === "Lower latency" ? currentColor : undefined,
              color: goal === "Lower latency" ? "white" : undefined,
              borderColor: goal === "Lower latency" ? currentColor : undefined
            }}
          >
            {goal}
          </Button>
        ))}
      </div>
    </>
  )
}