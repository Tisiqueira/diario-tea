"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Heart, LogOut } from "lucide-react";
import { Button } from "./button";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 stroke-pink-700 shadow-md">
            <p className="w-4 h-4 px-1 dark:stroke-pink-500 ">LA</p>
          </div>

          <div className="ml-3">
            <h2 className="text-base font-semibold text-foreground">
              Olá, Laura Alves!
            </h2>
            <p className="text-xs text-muted-foreground">
              Bem-vindo de volta 👋
            </p>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Diário TEA
          </h1>
        </div>

        <Button
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          variant="outline"
          size="sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
}
