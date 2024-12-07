"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { TrustedLogo } from "@/lib/types"

interface TrustedLogosProps {
  logos: TrustedLogo[]
  onChange: (logos: TrustedLogo[]) => void
}

export function TrustedLogos({ logos, onChange }: TrustedLogosProps) {
  const addLogo = () => {
    onChange([...logos, { id: crypto.randomUUID(), url: "", alt: "" }])
  }

  const removeLogo = (id: string) => {
    onChange(logos.filter(logo => logo.id !== id))
  }

  const updateLogo = (id: string, url: string) => {
    onChange(logos.map(logo => 
      logo.id === id ? { ...logo, url } : logo
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Trusted By Logos</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addLogo}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Logo
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {logos.map((logo) => (
          <Card key={logo.id} className="p-4">
            <div className="space-y-4">
              <ImageUpload
                value={logo.url}
                onChange={(url) => updateLogo(logo.id, url)}
                label="Company Logo"
              />
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-500 hover:text-red-600"
                onClick={() => removeLogo(logo.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}