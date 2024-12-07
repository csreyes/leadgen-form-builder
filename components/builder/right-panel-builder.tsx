"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { type StepConfig, type FormField } from "@/lib/types"

interface RightPanelBuilderProps {
  step: StepConfig
  onChange: (updates: Partial<StepConfig>) => void
}

export function RightPanelBuilder({ step, onChange }: RightPanelBuilderProps) {
  const addField = () => {
    onChange({
      fields: [
        ...step.fields,
        {
          id: crypto.randomUUID(),
          label: "",
          type: "text",
          required: false,
          fullWidth: true
        }
      ]
    })
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...step.fields]
    newFields[index] = { ...newFields[index], ...updates }
    onChange({ fields: newFields })
  }

  const removeField = (index: number) => {
    const newFields = [...step.fields]
    newFields.splice(index, 1)
    onChange({ fields: newFields })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Headline</Label>
        <Input
          value={step.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Subheadline</Label>
        <Input
          value={step.subheadline}
          onChange={(e) => onChange({ subheadline: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Form Fields</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>

        <div className="space-y-4">
          {step.fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 w-[200px]">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="multi-select">Multi Select</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="self-end text-gray-500 hover:text-red-600"
                    onClick={() => removeField(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {(field.type === "select" || field.type === "multi-select") && (
                  <div className="space-y-2">
                    <Label>Options (one per line)</Label>
                    <Textarea
                      value={field.options?.join("\n")}
                      onChange={(e) => updateField(index, {
                        options: e.target.value.split("\n").filter(Boolean)
                      })}
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(index, { required: checked })}
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.fullWidth}
                      onCheckedChange={(checked) => updateField(index, { fullWidth: checked })}
                    />
                    <Label>Full Width</Label>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}