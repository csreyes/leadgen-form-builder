import { TrustedTicker } from "./trusted-ticker";
import { placeholderLogos } from "@/lib/placeholder-logos";

export function TrustedExample() {
  return (
    <div className="bg-[#f97316] p-8">
      <TrustedTicker logos={placeholderLogos} showFadeOverlays={true} />
    </div>
  );
}
