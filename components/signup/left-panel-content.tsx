"use client";

import { motion } from "framer-motion";
import {
  Layers,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  Cpu,
  Rocket,
  LineChart,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { StepConfig, TrustedLogo } from "@/lib/types";
import { TrustedTicker } from "./trusted-ticker";
import Image from "next/image";

interface LeftPanelContentProps {
  step: StepConfig;
  backgroundColor?: string;
}

const icons: { [key: string]: any } = {
  Layers,
  DollarSign,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  Cpu,
  Rocket,
  LineChart,
  CheckCircle2,
  Zap,
};

export function LeftPanelContent({
  step,
  backgroundColor = "#f97316",
}: LeftPanelContentProps) {
  const content = step.panelContent as any;

  const logoDisplayMode = content.logoDisplayMode || "ticker"; // default to ticker if not set

  if (step.panelType === "main") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-4xl font-bold leading-tight text-white">
          {content.headline}
        </h2>
        <ul className="space-y-4 text-white">
          {content.valueProps?.map((prop: any, index: number) => {
            const Icon = icons[prop.icon];
            return (
              <li key={index} className="flex items-center gap-4 text-lg">
                {Icon && <Icon className="h-6 w-6 stroke-[1.5]" />}
                <span>{prop.text}</span>
              </li>
            );
          })}
        </ul>
        {content.trustedByLogos?.length > 0 && (
          <div className="pt-8">
            <p className="text-sm mb-3 text-white/80">
              Trusted by engineers at:
            </p>
            {logoDisplayMode === "ticker" ? (
              <TrustedTicker
                logos={content.trustedByLogos}
                showFadeOverlays={true}
                backgroundColor={backgroundColor}
              />
            ) : (
              <div className="flex items-center gap-6 text-white flex-wrap">
                {content.trustedByLogos.map((logo: TrustedLogo) => (
                  <div key={logo.id} className="relative w-32 h-8">
                    {logo.url ? (
                      <Image
                        src={logo.url}
                        alt={logo.alt}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (step.panelType === "value-props") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="space-y-4">
          {content.stats?.map((stat: any, index: number) => {
            const Icon = stat.icon ? icons[stat.icon] : null;
            return (
              <div key={index} className="bg-white/10 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-white/90 text-lg">{stat.label}</p>
                  </div>
                  {Icon && <Icon className="h-6 w-6 text-white/80" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.panelType === "testimonial") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="bg-white/10 p-6 rounded-xl">
          <p className="text-lg text-white mb-6">{content.quote}</p>
          <div className="flex items-center gap-4">
            {content.author?.avatar ? (
              <img
                src={content.author.avatar}
                alt={content.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20" />
            )}
            <div>
              <p className="font-bold text-white">{content.author?.name}</p>
              <p className="text-sm text-white/80">{content.author?.title}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step.panelType === "features") {
    return (
      <div className="space-y-8 max-w-md">
        <h2 className="text-3xl font-bold text-white">{content.headline}</h2>
        <div className="space-y-4">
          {content.features?.map((feature: any, index: number) => {
            const Icon = icons[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 p-6 rounded-xl"
              >
                <div className="flex items-start gap-4">
                  {Icon && <Icon className="h-6 w-6 text-white/90 mt-1" />}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.panelType === "success") {
    return (
      <div className="space-y-8 max-w-md">
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {content.headline}
            </h2>
            <p className="text-white/80 text-lg">{content.subheadline}</p>
          </motion.div>
        </div>
        <div className="space-y-4">
          {content.features?.map((feature: any, index: number) => {
            const Icon = icons[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{feature.title}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
