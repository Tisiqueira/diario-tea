"use client";
import Header from "../components/ui/header";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { TextArea } from "../components/ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Heart } from "lucide-react";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]); // 👈 lista de crianças disponíveis
  const [role, setRole] = useState(null); // 👈 perfil do usuário (Pai ou Profissional)

  const [formData, setFormData] = useState({
    child_id: "",
    activity_date: new Date().toISOString().split("T")[0],
    activity_type: "",
    behavior_description: "",
    keywords: "",
  });

  // 🔹 Carregar perfil e crianças disponíveis
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Buscar role no perfil
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setRole(profile.role);

        // Se for Pai — buscar filhos dele
        if (profile.role === "Pais") {
          const { data: childrenData, error: childrenError } = await supabase
            .from("children")
            .select("id, full_name")
            .eq("parent_id", user.id);

          if (childrenError) throw childrenError;
          setChildren(childrenData);
        }

        // Se for Profissional — buscar filhos que ele tem acesso
        else {
          const { data: accessData, error: accessError } = await supabase
            .from("child_access")
            .select("child_id, children(full_name, id)")
            .eq("professional_id", user.id);

          if (accessError) throw accessError;

          // converter estrutura para lista simples
          const formatted = accessData.map((item) => ({
            id: item.children.id,
            full_name: item.children.full_name,
          }));
          setChildren(formatted);
        }
      } catch (error) {
        console.error("Erro ao carregar crianças:", error);
        toast.error("Erro ao carregar lista de crianças.");
      }
    };

    fetchChildren();
  }, []);

  // 🔹 Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      toast.success("Criança selecionada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error(error.message || "Erro ao registrar atividade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-(--shadow-medium)]">
          <CardHeader>
            <CardTitle>Selecionar criança</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="child_id">Criança</Label>
                <Select
                  value={formData.child_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, child_id: value })
                  }
                  required
                  disabled={loading || children.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a criança" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {children.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma criança encontrada.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(`/client-register/${formData.child_id}`)
                  }
                  disabled={loading}
                  className="flex-1"
                >
                  Editar Cadastro
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Selecionar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
