import SumRegister from "../components/app/SumRegister";
import KeyWords from "../components/app/KeyWords";
import Actions from "../components/app/Actions";

import Header from "../components/ui/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <SumRegister />
          <KeyWords />
          <Actions />
        </div>
      </main>
    </div>
  );
}
