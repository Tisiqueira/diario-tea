"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { TrendingUp } from "lucide-react";

export default function KeyWords() {
  const [keywords, setKeywords] = useState({});

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Palavras-Chave</CardTitle>
        <TrendingUp className="h-4 w-4 text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-secondary">
          {Object.keys(keywords).length}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Únicas identificadas
        </p>
      </CardContent>
    </Card>
  );
}
