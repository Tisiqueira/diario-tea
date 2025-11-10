"use client";

import { useState } from "react";

import Header from "../components/ui/header";
import Label from "../components/ui/header";
import { Input } from "../components/ui/input";
import { TextArea } from "../components/ui/textArea";
import { Button } from "../components/ui/button";

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

export default function NovaAtividade() {
  const [loading, setLoading] = useState(false);
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

      const { error } = await supabase.from("activities").insert({
        user_id: user.id,
        activity_date: formData.activity_date,
        activity_type: formData.activity_type,
        behavior_description: formData.behavior_description,
        keywords: keywordsArray,
      });

      if (error) throw error;

      toast.success("Atividade registrada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Erro ao registrar atividade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
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
              <div className="space-y-2">
                <Label htmlFor="activity_date">Data da Atividade</Label>
                <Input
                  id="activity_date"
                  type="date"
                  /*value={formData.activity_date}
                  onChange={(e) =>
                    setFormData({ ...formData, activity_date: e.target.value })
                  }*/
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_type">Tipo de Atividade</Label>
                <Select
                  /*value={formData.activity_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activity_type: value })
                  }*/
                  disabled={loading}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO">Terapia Ocupacional (TO)</SelectItem>
                    <SelectItem value="Fono">Fonoaudiologia</SelectItem>
                    <SelectItem value="AT">
                      Acompanhante Terapêutico (AT)
                    </SelectItem>
                    <SelectItem value="Psico">Psicologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavior_description">
                  Descrição do Comportamento
                </Label>
                <TextArea
                  id="behavior_description"
                  /*value={formData.behavior_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      behavior_description: e.target.value,
                    })
                  }*/
                  placeholder="Descreva como foi a atividade e o comportamento da criança..."
                  rows={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-Chave (opcional)</Label>
                <Input
                  id="keywords"
                  /*value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }*/
                  placeholder="Separe por vírgula: cooperação, atenção, comunicação"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Palavras-chave ajudam a identificar padrões de evolução
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
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
}
