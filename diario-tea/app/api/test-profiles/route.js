import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // 1️⃣ Inserir um registro de teste
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: crypto.randomUUID(),
        full_name: "Usuário de Teste",
      },
    ]);

    if (insertError) {
      return Response.json({
        success: false,
        message: "Erro ao inserir",
        error: insertError.message,
      });
    }

    // 2️⃣ Buscar os registros recentes
    const { data, error: selectError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (selectError) {
      return Response.json({
        success: false,
        message: "Erro ao buscar registros",
        error: selectError.message,
      });
    }

    // 3️⃣ Retornar o resultado
    return Response.json({
      success: true,
      message: "Teste concluído com sucesso",
      count: data.length,
      data,
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: "Erro inesperado",
      error: err.message,
    });
  }
}
