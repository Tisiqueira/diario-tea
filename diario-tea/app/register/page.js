"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Layout from "../components/ui/layout";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkUser();
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Cria o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName, role },
        },
      });

      if (error) throw error;

      // Pega o usuário retornado
      const user = data.user;

      //Cria o registro na tabela "profiles"
      if (user) {
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: user.id, // mesmo ID do usuário
            full_name: fullName,
            role: role,
            email: email,
          },
        ]);

        if (profileError) throw profileError;
      }

      //Sucesso
      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const title = "Criar conta";
  const description = "Preencha os dados para iniciar sua jornada";

  return (
    <Layout title={title} description={description}>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity_type">Perfil</Label>
          <Select
            disabled={loading}
            required
            onValueChange={(value) => setRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AT">Acompanhante Terapêutico (AT)</SelectItem>
              <SelectItem value="Fono">Fonoaudiologia</SelectItem>
              <SelectItem value="Pais">Pais</SelectItem>
              <SelectItem value="Psico">Psicologia</SelectItem>
              <SelectItem value="TO">Terapia Ocupacional (TO)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full rounded-lg border bg-gradient-to-r from-primary to-secondary"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Já tem uma conta? Fazer login
        </Link>
      </div>
    </Layout>
  );
};

export default Register;
