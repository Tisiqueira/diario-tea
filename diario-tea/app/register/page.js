"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Layout from "../components/ui/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [clinicName, setClinicName] = useState(""); // 🏥 Nome da clínica
  const [children, setChildren] = useState([{ full_name: "" }]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.push("/dashboard");
    };
    checkUser();
  }, [router]);

  const handleAddChild = () => {
    setChildren([...children, { full_name: "" }]);
  };

  const handleChildChange = (index, value) => {
    const newChildren = [...children];
    newChildren[index].full_name = value;
    setChildren(newChildren);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Cria o usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { full_name: fullName, role },
        },
      });

      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("Usuário não criado.");

      // 2️⃣ Cria/atualiza perfil
      const { error: profileError } = await supabase.from("profiles").upsert([
        {
          id: user.id,
          full_name: fullName,
          role: role,
          email: email,
        },
      ]);
      if (profileError) throw profileError;

      // 3️⃣ Se for PAI → cria filhos
      if (role === "Pais") {
        const validChildren = children.filter((c) => c.full_name.trim() !== "");
        if (validChildren.length > 0) {
          const { error: childError } = await supabase.from("children").insert(
            validChildren.map((c) => ({
              parent_id: user.id,
              full_name: c.full_name,
            }))
          );
          if (childError) throw childError;
        }
      }

      // 4️⃣ Se for PROFISSIONAL → associa à clínica
      if (role !== "Pais") {
        if (!clinicName.trim()) throw new Error("Informe o nome da clínica.");

        // Verifica se a clínica já existe
        const { data: existingClinic, error: clinicFetchError } = await supabase
          .from("clinics")
          .select("id")
          .eq("name", clinicName.trim())
          .single();

        if (clinicFetchError && clinicFetchError.code !== "PGRST116") {
          throw clinicFetchError;
        }

        let clinicId;

        if (existingClinic) {
          clinicId = existingClinic.id;
        } else {
          // Cria nova clínica
          const { data: newClinic, error: clinicInsertError } = await supabase
            .from("clinics")
            .insert([{ name: clinicName.trim() }])
            .select()
            .single();

          if (clinicInsertError) throw clinicInsertError;
          clinicId = newClinic.id;
        }

        // Cria vínculo na tabela clinic_professionals
        const { error: linkError } = await supabase
          .from("clinic_professionals")
          .insert([
            {
              clinic_id: clinicId,
              professional_id: user.id,
              role: role,
            },
          ]);

        if (linkError) throw linkError;
      }

      toast.success("Conta criada com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const title = "Criar conta";
  const description = "Preencha os dados para iniciar sua jornada";

  return (
    <Layout title={title} description={description}>
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nome completo */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* E-mail */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        {/* Tipo de Perfil */}
        <div className="space-y-2">
          <Label htmlFor="role">Perfil</Label>
          <Select
            disabled={loading}
            required
            onValueChange={(value) => setRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Acompanhante Terapêutico (AT)">
                Acompanhante Terapêutico (AT)
              </SelectItem>
              <SelectItem value="Fonoaudiologia">Fonoaudiologia</SelectItem>
              <SelectItem value="Pais">Pais</SelectItem>
              <SelectItem value="Psicologia">Psicologia</SelectItem>
              <SelectItem value="Terapia ocupacional (TO)">
                Terapia Ocupacional (TO)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campo da clínica (só para profissionais) */}
        {role && role !== "Pais" && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="clinicName">Clínica</Label>
            <Input
              id="clinicName"
              type="text"
              placeholder="Nome da clínica"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        {/* Campos de filhos (só se for pai) */}
        {role === "Pais" && (
          <div className="space-y-2 mt-6">
            <Label>Filho(a)</Label>
            {children.map((child, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Nome do(a) filho(a)`}
                  value={child.full_name}
                  onChange={(e) => handleChildChange(index, e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            ))}
            {/* <Button type="button" variant="outline" onClick={handleAddChild}>
              + Adicionar outro filho
            </Button> */}
          </div>
        )}

        {/* Botão de envio */}
        <Button
          type="submit"
          className="w-full rounded-lg border bg-gradient-to-r from-primary to-secondary"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Já tem uma conta? Fazer login
        </Link>
      </div>
    </Layout>
  );
};

export default Register;
