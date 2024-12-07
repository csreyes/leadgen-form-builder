export type Step = 1 | 2 | 3 | 4

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
}