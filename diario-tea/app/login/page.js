"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";

import { Loader2, Heart } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) alert(error.message);
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-medium)]">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-[var(--shadow-soft)]">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription>Entre com sua conta para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">E-mail</Label>
              <input
                id="email"
                type="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">Senha</Label>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link href="/register" className="text-primary hover:underline">
              Não tem uma conta? Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
