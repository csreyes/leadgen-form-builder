"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { StepBuilder } from "./step-builder"
import { type ModalConfig, type StepConfig } from "@/lib/types"

interface ModalBuilderProps {
  config: ModalConfig
  onChange: (config: ModalConfig) => void
}

const defaultStep: StepConfig = {
  headline: "New Step",
  subheadline: "",
  panelType: "main",
  panelContent: {
    headline: "",
    valueProps: [],
    trustedByLogos: []
  },
  fields: []
}

export function ModalBuilder({ config, onChange }: ModalBuilderProps) {
  const addStep = () => {
    onChange({
      ...config,
      steps: [...config.steps, { ...defaultStep }]
    })
  }

  const removeStep = (index: number) => {
    const newSteps = [...config.steps]
    newSteps.splice(index, 1)
    onChange({ ...config, steps: newSteps })
  }

  const updateStep = (index: number, step: StepConfig) => {
    const newSteps = [...config.steps]
    newSteps[index] = step
    onChange({ ...config, steps: newSteps })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Steps</h2>
        <Button
          onClick={addStep}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      <Tabs defaultValue="0" className="space-y-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <TabsList>
            {config.steps.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()}>
                Step {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {config.steps.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeStep(parseInt(document.querySelector('[aria-selected="true"]')?.getAttribute('value') || "0"))}
              className="text-gray-500 hover:text-red-600 shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Current Step
            </Button>
          )}
        </div>

        {config.steps.map((step, index) => (
          <TabsContent key={index} value={index.toString()}>
            <Card className="p-6">
              <StepBuilder
                step={step}
                onChange={(updatedStep) => updateStep(index, updatedStep)}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}