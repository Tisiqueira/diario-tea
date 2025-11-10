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
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Atividade
        </Button>
      </CardContent>
    </Card>
  );
}
