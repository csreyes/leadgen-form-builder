import "dotenv/config";
import { supabase } from "../lib/supabase";

const testConfig = {
  headline: "Test Modal",
  valueProps: [
    { icon: "Layers", text: "Test Value Prop 1" },
    { icon: "DollarSign", text: "Test Value Prop 2" },
  ],
  steps: [
    {
      headline: "Step 1",
      subheadline: "Test step",
      panelType: "main",
      panelContent: {
        headline: "Train faster, cheaper models",
        valueProps: [
          { icon: "Layers", text: "Fine-tune models in minutes" },
          { icon: "DollarSign", text: "Cut costs by 10-100x" },
          { icon: "Rocket", text: "Deploy anywhere" },
          { icon: "LineChart", text: "Evaluate & monitor performance" },
        ],
        logoDisplayMode: "ticker",
        trustedByLogos: [
          "https://openpipe.ai/logos/vercel.svg",
          "https://openpipe.ai/logos/replit.svg",
          "https://openpipe.ai/logos/railway.svg",
        ],
      },
      fields: [
        {
          id: "email",
          type: "email",
          label: "Work Email",
          required: true,
          fullWidth: true,
        },
        {
          id: "firstName",
          type: "text",
          label: "First Name",
          required: true,
          fullWidth: false,
        },
        {
          id: "lastName",
          type: "text",
          label: "Last Name",
          required: true,
          fullWidth: false,
        },
      ],
    },
  ],
  style: {
    leftPanelColor: "#f97316",
    rightPanelMainColor: "#FFFFFF",
  },
  branding: {
    companyName: "OpenPipe",
  },
};

async function testModalConfig() {
  console.log("Testing modal config creation...");

  try {
    // Insert test config
    const { data, error } = await supabase
      .from("modal_configs")
      .insert([
        {
          config: testConfig,
          published: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    console.log("Successfully created modal config:", data);
    console.log(
      `Embed URL: ${process.env.NEXT_PUBLIC_APP_URL}/embed/${data.id}`
    );

    // Test fetching the config
    const { data: fetchedData, error: fetchError } = await supabase
      .from("modal_configs")
      .select("*")
      .eq("id", data.id)
      .single();

    if (fetchError) throw fetchError;

    console.log("Successfully fetched modal config:", fetchedData);
  } catch (error) {
    console.error("Error:", error);
  }
}

testModalConfig();
