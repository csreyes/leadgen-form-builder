import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Database = {
  public: {
    Tables: {
      modal_configs: {
        Row: {
          id: string;
          created_at: string;
          config: any;
          published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          config: any;
          published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          config?: any;
          published?: boolean;
        };
      };
    };
  };
};
