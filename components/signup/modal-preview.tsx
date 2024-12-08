"use client";

import { ModalContent } from "./modal-content";
import { ModalConfig } from "@/lib/types";

interface ModalPreviewProps {
  config: ModalConfig;
}

export function ModalPreview({ config }: ModalPreviewProps) {
  return (
    <div className="w-full h-full">
      <ModalContent config={config} />
    </div>
  );
}
