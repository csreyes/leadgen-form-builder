"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type FormData, type SignupModalProps, type Step } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import { LeftPanelContent } from "./left-panel-content"
import { FormSteps } from "./form-steps"

const STEPS = 4

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-20%" : "20%",
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    y: direction < 0 ? "-20%" : "20%",
    opacity: 0
  })
}

const transition = {
  y: { type: "tween", duration: 0.3, ease: "easeInOut" },
  opacity: { duration: 0.3 }
}

const colors = {
  orange: "#f97316",
  purple: "#9333ea"
}

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    currentModels: [],
    dailyCalls: "",
    source: "",
    comments: "",
  })

  const progress = (step / STEPS) * 100
  const currentColor = step % 2 === 0 ? colors.purple : colors.orange

  const handleNext = () => {
    if (step < STEPS) {
      setStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === STEPS) {
      // Handle form submission
      console.log(formData)
      onOpenChange(false)
    } else {
      handleNext()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] p-0 overflow-hidden">
        <div className="grid sm:grid-cols-2 min-h-[600px]">
          <div 
            className="relative overflow-hidden transition-colors duration-300 ease-in-out"
            style={{ backgroundColor: currentColor }}
          >
            <AnimatePresence custom={step} mode="popLayout" initial={false}>
              <motion.div
                key={step}
                custom={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 p-12"
              >
                <LeftPanelContent step={step} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-10 bg-white overflow-hidden">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  {step > 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleBack}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: currentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: currentColor }} />
                <span className="text-xl font-semibold">OpenPipe</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <FormSteps 
                    step={step}
                    formData={formData}
                    setFormData={setFormData}
                    currentColor={currentColor}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit"
                  className="rounded-full px-8 py-6 text-lg"
                  style={{ 
                    backgroundColor: currentColor,
                    color: "white"
                  }}
                >
                  {step === STEPS ? "Submit" : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}