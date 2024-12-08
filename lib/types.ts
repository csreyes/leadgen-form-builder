import { FormFieldType } from "./types";
// lib/types.ts
export type TrustedLogo = {
  id: string;
  url: string;
  alt: string;
};

export type PanelType =
  | "main"
  | "value-props"
  | "testimonial"
  | "features"
  | "success";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "select" | "multi-select" | "textarea";
  required: boolean;
  fullWidth: boolean;
  options?: string[];
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  fullWidth: boolean;
  options?: string[];
}

export interface Author {
  name: string;
  title: string;
  avatar?: string;
}

export interface PanelContentMain {
  headline: string;
  valueProps: { icon: string; text: string }[];
  trustedByLogos: TrustedLogo[];
}

export interface PanelContentValueProps {
  headline: string;
  stats: { value: string; label: string; icon?: string }[];
}

export interface PanelContentTestimonial {
  headline: string;
  quote: string;
  author: Author;
}

export interface PanelContentFeatures {
  headline: string;
  features: { title: string; description: string; icon: string }[];
}

export interface PanelContentSuccess {
  headline: string;
  subheadline: string;
  features: { title: string; icon: string }[];
}

export type PanelContent =
  | PanelContentMain
  | PanelContentValueProps
  | PanelContentTestimonial
  | PanelContentFeatures
  | PanelContentSuccess
  | Record<string, any>;

export interface StepConfig {
  headline: string;
  subheadline?: string;
  panelType: PanelType;
  panelContent?: any;
  fields: FormField[];
  inheritPreviousPanel?: boolean;
  panelBackgroundColor?: string;
  // Add display mode for logos
  // If omitted, default to ticker or static as you prefer
  // We'll store it in panelContent for simplicity:
  // panelContent: { ..., logoDisplayMode?: "ticker" | "static" }
}

export interface ModalConfig {
  headline: string;
  valueProps: { icon: string; text: string }[];
  logo: string;
  trustedByLogos: TrustedLogo[];
  steps: StepConfig[];
  style?: {
    leftPanelPadding?: string;
    leftPanelColor?: string;
    rightPanelMainColor?: string;
  };
}

export type FormData = Record<string, string>;
export type Step = number;
