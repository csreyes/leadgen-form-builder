export type Step = 1 | 2 | 3 | 4 | 5

export interface FormData {
  email: string
  firstName: string
  lastName: string
  currentModels: string[]
  dailyCalls: string
  source: string
  comments: string
}

export interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config?: ModalConfig
}

export type PanelType = 'main' | 'value-props' | 'testimonial' | 'features' | 'success'

export interface ModalConfig {
  headline: string
  valueProps: ValueProp[]
  logo: string
  trustedByLogos: TrustedLogo[]
  steps: StepConfig[]
}

export interface StepConfig {
  headline: string
  subheadline: string
  panelType: PanelType
  panelContent: MainPanel | ValuePropsPanel | TestimonialPanel | FeaturesPanel | SuccessPanel
  fields: FormField[]
}

export interface MainPanel {
  headline: string
  valueProps: ValueProp[]
  trustedByLogos: TrustedLogo[]
}

export interface ValuePropsPanel {
  headline: string
  stats: {
    value: string
    label: string
    icon?: string
  }[]
}

export interface TestimonialPanel {
  headline: string
  quote: string
  author: {
    name: string
    title: string
    avatar?: string
  }
}

export interface FeaturesPanel {
  headline: string
  features: {
    title: string
    description: string
    icon: string
  }[]
}

export interface SuccessPanel {
  headline: string
  subheadline: string
  features: {
    title: string
    icon: string
  }[]
}

export interface ValueProp {
  icon: string
  text: string
}

export interface TrustedLogo {
  id: string
  url: string
  alt: string
}

export interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  fullWidth: boolean
  options?: string[]
}