"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Calendar } from "lucide-react";

export default function SumRegister() {
  const [activities, setActivities] = useState([10]);
  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total de Registros
        </CardTitle>
        <Calendar className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {activities.length}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Últimas 10 atividades
        </p>
      </CardContent>
    </Card>
  );
}
