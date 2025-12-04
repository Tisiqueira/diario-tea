"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { toast } from "sonner";

export default function RequestChildAccess() {
  const [aliasChild, setAliasChild] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!aliasChild.trim()) {
        toast.error("Informe o código da criança.");
        setLoading(false);
        return;
      }

      // Usuário logado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("user:", user);

      // Buscar criança pelo alias
      const { data: child, error: childError } = await supabase
        .from("children")
        .select("id, full_name")
        .eq("alias_public_id", aliasChild.trim())
        .maybeSingle();

      console.log("child:", child, "childError:", childError);

      if (!child) {
        toast.error("Código não encontrado.");
        setLoading(false);
        return;
      }

      // Verifica se já existe solicitação
      const { data: existing } = await supabase
        .from("child_access_requests")
        .select("id")
        .eq("child_id", child.id)
        .eq("professional_id", user.id)
        .maybeSingle();

      if (existing) {
        toast.error("Você já enviou uma solicitação para esta criança.");
        setLoading(false);
        return;
      }

      // Criar solicitação
      const result = await supabase
        .from("child_access_requests")
        .insert({
          child_id: child.id,
          professional_id: user.id,
          status: "pending",
        })
        .select();

      console.log("RESULT INSERT:", result);

      if (result.error) {
        if (result.error.code === "23505") {
          toast.error("Você já enviou uma solicitação para esta criança.");
        } else {
          toast.error("Erro ao enviar solicitação.");
        }

        setLoading(false);
        return;
      }

      toast.success("Solicitação enviada. Aguarde aprovação.");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erro ao solicitar acesso:", error);
      toast.error("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Solicitar acesso à criança</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Código da criança</Label>
              <Input
                placeholder="Ex: ABX921"
                value={aliasChild}
                onChange={(e) => setAliasChild(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
