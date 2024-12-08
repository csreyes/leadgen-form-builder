"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrustedLogo } from "@/lib/types";

interface TrustedTickerProps {
  logos: TrustedLogo[];
  showFadeOverlays?: boolean;
}

const DEFAULT_IMAGE =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAZhtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAANGlsb2MAAAAAREAAAgACAAAAAAG8AAEAAAAAAAAAHAABAAAAAAHYAAEAAAAAAAACCwAAADhpaW5mAAAAAAACAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAFWluZmUCAAAAAAIAAGF2MDEAAAAA12lwcnAAAACxaXBjbwAAABNjb2xybmNseAABAA0ABoAAAAAMYXYxQ4EAHAAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAAA5waXhpAAAAAAEIAAAAOGF1eEMAAAAAdXJuOm1wZWc6bXBlZ0I6Y2ljcDpzeXN0ZW1zOmF1eGlsaWFyeTphbHBoYQAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAIAAAAAqwAAABBwaXhpAAAAAAMICAgAAAAeaXBtYQAAAAAAAAACAAEEAYYHCAACBIIDBIUAAAAaaXJlZgAAAAAAAAAOYXV4bAACAAEAAQAAAi9tZGF0EgAKBhgh//VMKjIQENAAAEABSBkszhFh/reTUBIACgk4If/1TCAhoNIy+wMQ0AGGFIFAACcnGo2Od9cUTxSM4gmv2Xt4hMK1Nsc9xtzr725oEymoe+XRqSx8GuDl8SG+3Rlrm1AVfRzIWZGcU6q+swM891K4NBA23u2iCmBY4izWam5dI9YXFGJ/S3z3lTCpZss5cz3Ce6rE3V9C+4oOYf/lp5019RKyo9CF0eUSR5+743YtZbrWY0Qh1H95orqCcHrvImaGq8pgkUVQgzTH8eTQxALSVdNhAOQlAQl1Hek/utG1E6Zpbcv4/nmoRko4R1t9n7FHO0AWbBsR2iSM1nw8NcIksF/TJ41KoXh5E1OAjTfX6XsuoUYSQdm0NhsXblCApJdVvJhq7gnlegPE87dnSERuYlNFGCltEzCo1VI3IGTuw67eB2WGoKbMgsKYbDuPJ6IzpXvWgnZRPZy/iJ5wuUR/DqtrhL0adIMmhHNUNpI1ZoXcThkHYFfKxd9n+o69zSSlv+kMZiveZdEwEvC0A6YuqJwZM8VIlCmad/LIWSG0dOMyBP2IlqTP/qRQK96gpY299zJ2C2h1+5mkVrCQQ6fRHrl53WCxYfNY81S5bthBEhvLIwHJ8P9nYMOc1FKhOFX7IAfRYk7AuWanyOpcND2HHjURP5qb5y/7YtXP53IGqxVY8GDjti7ApbbZ9bsKhCpUz0Bf7rc3Fx5+Jgx/Ph7CTXA=";

export function TrustedTicker({
  logos,
  showFadeOverlays = false,
}: TrustedTickerProps) {
  if (logos.length === 0) return null;

  return (
    <div className="relative h-12 overflow-hidden">
      {showFadeOverlays && (
        <>
          <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[#f97316] to-transparent z-10" />
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#f97316] to-transparent z-10" />
        </>
      )}

      <motion.div
        className="flex items-center gap-8 absolute whitespace-nowrap"
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {logos.map((logo) => (
              <div key={logo.id} className="relative w-32 h-8 shrink-0">
                <Image
                  src={
                    logo.url?.startsWith("/")
                      ? DEFAULT_IMAGE
                      : logo.url || DEFAULT_IMAGE
                  }
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
  );
}
