"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { TrustedLogo } from "@/lib/types"

interface TrustedTickerProps {
  logos: TrustedLogo[]
}

export function TrustedTicker({ logos }: TrustedTickerProps) {
  if (logos.length === 0) return null

  return (
    <div className="relative h-12 overflow-hidden">
      <motion.div
        className="flex items-center gap-8 absolute"
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear"
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {logos.map((logo) => (
              <div key={logo.id} className="relative w-32 h-8">
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}