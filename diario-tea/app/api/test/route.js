import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);

  if (error) return Response.json({ connected: false, error: error.message });
  return Response.json({ connected: true, data });
}
