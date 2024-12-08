import { TrustedLogo } from "./types";

// Base64 encoded transparent 1x1 pixel PNG
const transparentPixel =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

export const placeholderLogos: TrustedLogo[] = [
  {
    id: "placeholder-1",
    url: transparentPixel,
    alt: "Trusted Company 1",
  },
  {
    id: "placeholder-2",
    url: transparentPixel,
    alt: "Trusted Company 2",
  },
  {
    id: "placeholder-3",
    url: transparentPixel,
    alt: "Trusted Company 3",
  },
];
