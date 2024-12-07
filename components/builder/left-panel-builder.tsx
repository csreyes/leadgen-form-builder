"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { type StepConfig, type PanelType } from "@/lib/types"
import { TrustedLogos } from "./trusted-logos"

interface LeftPanelBuilderProps {
  step: StepConfig
  onChange: (updates: Partial<StepConfig>) => void
}

export function LeftPanelBuilder({ step, onChange }: LeftPanelBuilderProps) {
  const updatePanelContent = (updates: any) => {
    onChange({
      panelContent: {
        ...step.panelContent,
        ...updates
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Panel Type</Label>
        <Select
          value={step.panelType}
          onValueChange={(value: PanelType) => onChange({ panelType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="value-props">Value Props</SelectItem>
            <SelectItem value="testimonial">Testimonial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {step.panelType === "main" && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Value Props</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const valueProps = [...(step.panelContent as any).valueProps]
                  valueProps.push({ icon: "Star", text: "" })
                  updatePanelContent({ valueProps })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Value Prop
              </Button>
            </div>
            {(step.panelContent as any).valueProps?.map((prop: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Icon</Label>
                    <Input
                      value={prop.icon}
                      onChange={(e) => {
                        const valueProps = [...(step.panelContent as any).valueProps]
                        valueProps[index].icon = e.target.value
                        updatePanelContent({ valueProps })
                      }}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Text</Label>
                    <Input
                      value={prop.text}
                      onChange={(e) => {
                        const valueProps = [...(step.panelContent as any).valueProps]
                        valueProps[index].text = e.target.value
                        updatePanelContent({ valueProps })
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="self-end text-gray-500 hover:text-red-600"
                    onClick={() => {
                      const valueProps = [...(step.panelContent as any).valueProps]
                      valueProps.splice(index, 1)
                      updatePanelContent({ valueProps })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <TrustedLogos
            logos={(step.panelContent as any).trustedByLogos || []}
            onChange={(logos) => updatePanelContent({ trustedByLogos: logos })}
          />
        </Card>
      )}

      {step.panelType === "value-props" && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Stats</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const stats = [...(step.panelContent as any).stats]
                  stats.push({ value: "", label: "", icon: "ChevronRight" })
                  updatePanelContent({ stats })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stat
              </Button>
            </div>
            {(step.panelContent as any).stats?.map((stat: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const stats = [...(step.panelContent as any).stats]
                          stats[index].value = e.target.value
                          updatePanelContent({ stats })
                        }}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const stats = [...(step.panelContent as any).stats]
                          stats[index].label = e.target.value
                          updatePanelContent({ stats })
                        }}
                      />
                    </div>
                    <div className="space-y-2 w-[150px]">
                      <Label>Icon</Label>
                      <Select
                        value={stat.icon}
                        onValueChange={(value) => {
                          const stats = [...(step.panelContent as any).stats]
                          stats[index].icon = value
                          updatePanelContent({ stats })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ChevronDown">Down</SelectItem>
                          <SelectItem value="ChevronRight">Right</SelectItem>
                          <SelectItem value="ChevronUp">Up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="self-end text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const stats = [...(step.panelContent as any).stats]
                        stats.splice(index, 1)
                        updatePanelContent({ stats })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {step.panelType === "testimonial" && (
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={(step.panelContent as any).headline}
              onChange={(e) => updatePanelContent({ headline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Quote</Label>
            <Input
              value={(step.panelContent as any).quote}
              onChange={(e) => updatePanelContent({ quote: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Author Name</Label>
            <Input
              value={(step.panelContent as any).author?.name}
              onChange={(e) => updatePanelContent({
                author: {
                  ...(step.panelContent as any).author,
                  name: e.target.value
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Author Title</Label>
            <Input
              value={(step.panelContent as any).author?.title}
              onChange={(e) => updatePanelContent({
                author: {
                  ...(step.panelContent as any).author,
                  title: e.target.value
                }
              })}
            />
          </div>
        </Card>
      )}
    </div>
  )
}