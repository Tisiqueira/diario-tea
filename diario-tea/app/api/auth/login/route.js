import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ user: data.user });
}
