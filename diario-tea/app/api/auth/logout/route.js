import { supabase } from "@/lib/supabaseClient";

export async function POST() {
  const { error } = await supabase.auth.signOut();
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true });
}
