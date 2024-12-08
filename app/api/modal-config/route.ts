import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { config, publish = false } = await request.json();

    const { data, error } = await supabase
      .from("modal_configs")
      .insert([
        {
          config,
          published: publish,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const embedUrl = `${process.env.NEXT_PUBLIC_APP_URL}/embed/${data.id}`;

    return NextResponse.json({ success: true, data: { ...data, embedUrl } });
  } catch (error) {
    console.error("Error saving modal config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save modal config" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing config ID" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("modal_configs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching modal config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch modal config" },
      { status: 500 }
    );
  }
}
