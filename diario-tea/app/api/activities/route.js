import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("activities")
    .select("id, activity_type, behavior_description, created_at");

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(data);
}

export async function POST(request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("activities")
    .insert([body])
    .select();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data[0]);
}
