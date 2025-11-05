import { createServerSupabase } from "@/utils/supabaseServer";

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json(data);
}
