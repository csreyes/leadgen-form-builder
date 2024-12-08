import { ModalConfig } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { ClientForm } from "@/components/signup/client-form";

// This is needed for dynamic routes in Next.js
export async function generateStaticParams() {
  const { data } = await supabase
    .from("modal_configs")
    .select("id")
    .eq("published", true);

  return (data || []).map((config) => ({
    id: config.id,
  }));
}

// For dynamic routes that aren't pre-rendered
export const dynamicParams = true;

export default async function EmbedPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, error } = await supabase
    .from("modal_configs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return (
      <div className="p-4 text-red-500">Failed to load modal configuration</div>
    );
  }

  const config = data.config as ModalConfig;

  return (
    <div className="w-full min-h-screen overflow-auto">
      <ClientForm config={config} />
    </div>
  );
}
