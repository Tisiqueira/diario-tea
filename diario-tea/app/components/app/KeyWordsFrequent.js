"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export default function KeyWordsFrequent({ keywords }) {
  const topKeywords = Object.entries(keywords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (topKeywords.length === 0) return null;

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-col space-y-1.5 p-6">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
          Palavras-chave mais frequentes
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Termos que aparecem com mais frequência nos registros
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topKeywords.map(([keyword, count]) => (
            <Badge key={keyword} variant="secondary" className="text-sm">
              {keyword} ({count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
