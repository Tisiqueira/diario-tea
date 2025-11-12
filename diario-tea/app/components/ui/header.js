"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Heart, LogOut } from "lucide-react";
import { Button } from "./button";

export default function Header({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {children}
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
