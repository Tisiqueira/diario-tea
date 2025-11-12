"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";

const AddAccess = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [formData, setFormData] = useState({
    child_id: "",
    professional_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Verifica se é pai
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profile.role !== "Pais") {
          toast.error("Apenas pais podem conceder acesso.");
          router.push("/dashboard");
          return;
        }

        // Buscar filhos do pai
        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("id, full_name")
          .eq("parent_id", user.id);

        if (childrenError) throw childrenError;
        setChildren(childrenData);

        // Buscar profissionais disponíveis (não pais)
        const { data: professionalsData, error: professionalsError } =
          await supabase
            .from("profiles")
            .select("id, full_name, role, email")
            .neq("role", "Pais");

        if (professionalsError) throw professionalsError;
        setProfessionals(professionalsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar informações.");
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.child_id || !formData.professional_id) {
        toast.error("Selecione a criança e o profissional.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("child_access").insert([
        {
          child_id: formData.child_id,
          professional_id: formData.professional_id,
        },
      ]);

      if (error) throw error;

      toast.success("Acesso concedido com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao conceder acesso:", error);
      if (error.message?.includes("duplicate key value"))
        toast.error("Este profissional já tem acesso a esta criança.");
      else toast.error(error.message || "Erro ao conceder acesso.");
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
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Conceder Acesso a Profissional
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle>Conceder Acesso</CardTitle>
            <CardDescription>
              Permita que um profissional acompanhe um dos seus filhos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selecionar Criança */}
              <div className="space-y-2">
                <Label htmlFor="child_id">Selecione a Criança</Label>
                <Select
                  value={formData.child_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, child_id: value })
                  }
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o filho" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selecionar Profissional */}
              <div className="space-y-2">
                <Label htmlFor="professional_id">
                  Selecione o Profissional
                </Label>
                <Select
                  value={formData.professional_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, professional_id: value })
                  }
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} ({p.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className="flex-1 bg-linear-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Conceder Acesso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddAccess;
