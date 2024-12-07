"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SignupModal } from "@/components/signup/signup-modal"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Train faster, cheaper models on production data
        </h1>
        <p className="text-xl text-gray-600">
          OpenPipe helps you fine-tune and deploy models that are faster and cheaper than GPT-4, trained on your production data.
        </p>
        <div>
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            className="rounded-full bg-black hover:bg-gray-900 text-white px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
      <SignupModal open={open} onOpenChange={setOpen} />
    </div>
  )
}