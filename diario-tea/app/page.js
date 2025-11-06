"use client";

import { useRouter } from "next/navigation";
import { Button } from "./components/ui/button";
import { Heart, TrendingUp, Calendar, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full shadow-md mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl pt-6 md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Diário TEA
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
              Acompanhe e registre a evolução diária de crianças autistas de
              forma simples e carinhosa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Registro Diário</h3>
              <p className="text-sm text-muted-foreground">
                Registre atividades, comportamentos e progressos de forma
                organizada
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-lg font-semibold mb-2">Acompanhamento</h3>
              <p className="text-sm text-muted-foreground">
                Visualize a evolução através de palavras-chave e padrões
                identificados
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card shadow-md hover:shadow-lg transition-all">
              <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-lg font-semibold mb-2">Colaboração</h3>
              <p className="text-sm text-muted-foreground">
                Compartilhe progresso com pais e familiares com comentários e
                interação
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => router.push("/register")}
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Começar Agora
            </Button>
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              variant="outline"
              className="text-lg px-8"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
