"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Plus } from "lucide-react";

export default function Actions() {
  const router = useRouter();
  return (
    <Card className="md:col-span-2 lg:col-span-1 shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ação Rápida</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => router.push("/new-activity")}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Atividade
        </Button>
      </CardContent>
    </Card>
  );
}
