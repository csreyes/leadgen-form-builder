"use client"

import { motion } from "framer-motion"
import { Layers, DollarSign, Sparkles } from 'lucide-react'
import { Step } from "@/lib/types"

interface LeftPanelContentProps {
  step: Step
}

export function LeftPanelContent({ step }: LeftPanelContentProps) {
  if (step === 1) {
    return (
      <div className="space-y-12">
        <h2 className="text-3xl font-bold leading-tight text-white">
          Train faster, cheaper models on production data
        </h2>
        <ul className="space-y-6 text-white">
          <li className="flex items-center gap-4">
            <Layers className="h-5 w-5 stroke-[1.5]" />
            <span className="text-lg">Train & deploy fine-tuned models</span>
          </li>
          <li className="flex items-center gap-4">
            <DollarSign className="h-5 w-5 stroke-[1.5]" />
            <span className="text-lg">Save time and money</span>
          </li>
          <li className="flex items-center gap-4">
            <Sparkles className="h-5 w-5 stroke-[1.5]" />
            <span className="text-lg">Get higher quality than OpenAI</span>
          </li>
        </ul>
        <div className="pt-8">
          <p className="text-sm mb-6 text-white/80">Trusted by engineers at:</p>
          <div className="flex items-center gap-8">
            <span className="text-white/90 text-lg">visualping</span>
            <span className="text-white/90 text-lg">Rakuten</span>
            <span className="text-white/90 text-lg">FATHOM</span>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Why use OpenPipe?</h2>
        <div className="space-y-4">
          <div className="bg-white/10 p-6 rounded-xl">
            <div>
              <p className="text-3xl font-bold text-white">14x</p>
              <p className="text-white/90 text-lg">Cheaper than GPT-4 Turbo</p>
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-xl">
            <div>
              <p className="text-3xl font-bold text-white">5min</p>
              <p className="text-white/90 text-lg">To start collecting training data</p>
            </div>
          </div>
          <div className="bg-white/10 p-6 rounded-xl">
            <div>
              <p className="text-3xl font-bold text-white">$7M</p>
              <p className="text-white/90 text-lg">Saved by our customers this year</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">What our users say</h2>
        <div className="bg-white/10 p-6 rounded-xl">
          <p className="text-lg text-white mb-6">
            "OpenPipe increased our inference speed by 3x compared to GPT4-turbo while reducing cost by >10x. It's a no-brainer for any company that uses LLMs in prod."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20" />
            <div>
              <p className="font-bold text-white">David Paffenholz</p>
              <p className="text-sm text-white/80">CEO & Co-founder • Juicebox</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">
        Your datasets, models and evaluations in one place.
      </h2>
      <ul className="space-y-4 text-lg text-white">
        <li>• Capture Data</li>
        <li>• Train Models</li>
        <li>• Automatic Deployment</li>
        <li>• Evaluate & Compare</li>
      </ul>
    </div>
  )
}