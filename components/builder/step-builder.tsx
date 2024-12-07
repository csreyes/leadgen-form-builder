"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeftPanelBuilder } from "./left-panel-builder"
import { RightPanelBuilder } from "./right-panel-builder"
import { type StepConfig } from "@/lib/types"

interface StepBuilderProps {
  step: StepConfig
  onChange: (step: StepConfig) => void
}

export function StepBuilder({ step, onChange }: StepBuilderProps) {
  return (
    <Tabs defaultValue="left" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="left">Left Panel</TabsTrigger>
        <TabsTrigger value="right">Right Panel</TabsTrigger>
      </TabsList>
      <TabsContent value="left" className="space-y-6">
        <LeftPanelBuilder
          step={step}
          onChange={(updates) => onChange({ ...step, ...updates })}
        />
      </TabsContent>
      <TabsContent value="right" className="space-y-6">
        <RightPanelBuilder
          step={step}
          onChange={(updates) => onChange({ ...step, ...updates })}
        />
      </TabsContent>
    </Tabs>
  )
}