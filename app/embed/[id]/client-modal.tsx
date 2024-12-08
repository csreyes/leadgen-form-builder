"use client";

import { ModalContent } from "@/components/signup/modal-content";
import { FormData, ModalConfig } from "@/lib/types";

export function ClientModalContent({ config }: { config: ModalConfig }) {
  const handleSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);
    // Here you can implement the actual form submission logic
  };

  return <ModalContent config={config} onSubmit={handleSubmit} />;
}
