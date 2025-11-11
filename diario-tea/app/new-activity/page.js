"use client";

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

const NewActivity = () => {
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

      const keywordsArray = formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);

      // Inserir atividade
      const { error } = await supabase.from("activities").insert([
        {
          user_id: user.id,
          child_id: formData.child_id, // 👈 criança selecionada
          activity_date: formData.activity_date,
          activity_type: formData.activity_type,
          behavior_description: formData.behavior_description,
          keywords: keywordsArray,
        },
      ]);

      if (error) throw error;

      toast.success("Atividade registrada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error(error.message || "Erro ao registrar atividade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nova Atividade
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle>Registrar Nova Atividade</CardTitle>
            <CardDescription>
              Preencha os dados da atividade realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 🔹 Campo: Criança */}
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

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="activity_date">Data da Atividade</Label>
                <Input
                  id="activity_date"
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_date: e.target.value })
                  }
                  required
                  disabled={loading}
                />
              </div>

              {/* Tipo de atividade */}
              <div className="space-y-2">
                <Label htmlFor="activity_type">Tipo de Atividade</Label>
                <Select
                  value={formData.activity_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activity_type: value })
                  }
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo da atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fonoaudiologia">
                      Fonoaudiologia
                    </SelectItem>
                    <SelectItem value="Psicologia ABA">
                      Psicologia ABA
                    </SelectItem>
                    <SelectItem value="Terapia Ocupacional">
                      Terapia Ocupacional
                    </SelectItem>
                    <SelectItem value="Acompanhante Terapêutico (AT)">
                      Acompanhante Terapêutico (AT)
                    </SelectItem>
                    <SelectItem value="Psicomotricista">
                      Psicomotricista
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="behavior_description">
                  Descrição do Comportamento
                </Label>
                <TextArea
                  id="behavior_description"
                  value={formData.behavior_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      behavior_description: e.target.value,
                    })
                  }
                  placeholder="Descreva como foi a atividade..."
                  rows={6}
                  required
                  disabled={loading}
                />
              </div>

              {/* Palavras-chave */}
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-Chave (opcional)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="atenção, cooperação, fala..."
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Atividade
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewActivity;
