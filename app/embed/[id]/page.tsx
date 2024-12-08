"use client";

import { useEffect, useState } from "react";
import { ModalConfig } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ClientForm } from "@/components/signup/client-form";

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
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen overflow-auto">
      <ClientForm config={config} />
    </div>
  );
}
