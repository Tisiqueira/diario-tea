"use client";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function RecentActivity() {
  const [loading, setLoading] = useState(true);
  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas atividades registradas</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">
            Carregando...
          </p>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma atividade registrada ainda
            </p>
            <Button onClick={() => navigate("/new-activity")} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Registrar primeira atividade
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => navigate(`/activity/${activity.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant="outline">{activity.activity_type}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(activity.activity_date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-sm line-clamp-2">
                  {activity.behavior_description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
