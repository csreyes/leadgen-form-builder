"use client";

import { FormData, ModalConfig } from "@/lib/types";
import { ModalContent } from "./modal-content";

export function ClientForm({ config }: { config: ModalConfig }) {
  const handleSubmit = async (formData: FormData) => {
    console.log("Form submitted:", formData);
    // Here you can implement the actual form submission logic
  };

  return <ModalContent config={config} onSubmit={handleSubmit} />;
}
