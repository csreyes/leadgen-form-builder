// app/embed/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { ModalConfig } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ClientForm } from "@/components/signup/client-form";
import { Loader2 } from "lucide-react";

export default function EmbedPage({ params }: { params: { id: string } }) {
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from("modal_configs")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        setError("Failed to load modal configuration");
        return;
      }

      setConfig(data.config as ModalConfig);
    }

    fetchConfig();
  }, [params.id]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!config) {
    return (
      <div className="p-4 flex items-center justify-center w-full h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen overflow-auto">
      <ClientForm config={config} />
    </div>
  );
}
