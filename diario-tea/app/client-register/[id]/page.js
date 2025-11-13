"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { TextArea } from "../../components/ui/textArea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Heart } from "lucide-react";

export default function ChildDetailsForm() {
  const router = useRouter();
  const { id } = useParams(); // 👈 pega o ID da URL automaticamente

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [communicationLevel, setCommunicationLevel] = useState("");
  const [notes, setNotes] = useState("");

  // 🔹 Busca os dados da criança
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) router.push("/login");
    };
    checkUser();

    const fetchChild = async () => {
      try {
        const { data, error } = await supabase
          .from("children")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setChild(data);
        setFullName(data.full_name || "");
        setBirthDate(data.birth_date || "");
        setGender(data.gender || "");
        setDiagnosis(data.diagnosis || "");
        setCommunicationLevel(data.communication_level || "");
        setNotes(data.notes || "");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar informações da criança.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchChild();
  }, [id]);

  // 🔹 Atualiza os dados
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("children")
        .update({
          full_name: fullName,
          birth_date: birthDate,
          gender,
          diagnosis,
          communication_level: communicationLevel,
          notes,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Informações atualizadas com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar informações.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Carregando dados da criança...</p>;
  if (!child) return <p>Nenhuma criança encontrada.</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
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
            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Nova Atividade
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Nome completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={updating}
            />
          </div>

          {/* Data de nascimento */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              disabled={updating}
            />
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              disabled={updating}
              value={gender}
              onValueChange={setGender}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diagnóstico */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Input
              id="diagnosis"
              type="text"
              placeholder="Ex: TEA nível 2, TDAH..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              disabled={updating}
            />
          </div>

          {/* Nível de comunicação */}
          <div className="space-y-2">
            <Label htmlFor="communicationLevel">Nível de comunicação</Label>
            <Select
              disabled={updating}
              value={communicationLevel}
              onValueChange={setCommunicationLevel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verbal">Verbal</SelectItem>
                <SelectItem value="Pouco verbal">Pouco verbal</SelectItem>
                <SelectItem value="Não verbal">Não verbal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <TextArea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferências, rotina, pontos de atenção..."
              disabled={updating}
            />
          </div>

          <Button type="submit" className="w-full" disabled={updating}>
            {updating ? "Salvando..." : "Salvar informações"}
          </Button>
        </form>
      </main>
    </div>
  );
}
