"use client";

import { Toaster, toast } from "sonner";
import { Button } from "@/app/components/ui/button";

export default function TesteToaster() {
  return (
    <div className="p-10 space-y-4">
      <Toaster richColors position="top-right" />

      <h1 className="text-2xl font-bold">Teste do Toaster</h1>

      <Button onClick={() => toast.success("Funcionou!")}>
        Mostrar Toast Sucesso
      </Button>

      <Button
        variant="destructive"
        onClick={() => toast.error("Algo deu errado")}
      >
        Mostrar Toast Erro
      </Button>
    </div>
  );
}
