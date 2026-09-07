import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Clock3, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Entrar | Ponto Certo — Controle de ponto" },
      {
        name: "description",
        content:
          "Acesse o Ponto Certo para registrar e acompanhar a jornada de trabalho da sua equipe pelo celular.",
      },
      { property: "og:title", content: "Entrar | Ponto Certo — Controle de ponto" },
      {
        property: "og:description",
        content: "Sistema de controle de ponto de funcionários, simples e feito para o celular.",
      },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").max(72),
});

const cadastroSchema = loginSchema.extend({
  nome: z.string().trim().min(2, "Informe seu nome completo.").max(100),
});

function LoginPage() {
  const { session, role, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: role === "admin" ? "/admin" : "/painel", replace: true });
    }
  }, [loading, session, role, navigate]);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setAviso(null);
    const check = loginSchema.safeParse({ email, senha });
    if (!check.success) {
      setErro(check.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }
    setEnviando(true);
    const { error } = await signIn(email, senha);
    setEnviando(false);
    if (error) setErro(error);
  }

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setAviso(null);
    const check = cadastroSchema.safeParse({ nome, email, senha });
    if (!check.success) {
      setErro(check.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }
    setEnviando(true);
    const { error, precisaConfirmar } = await signUp(nome, email, senha);
    setEnviando(false);
    if (error) {
      setErro(error);
      return;
    }
    if (precisaConfirmar) {
      setAviso("Conta criada. Confirme o e-mail enviado para você antes de entrar.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-hero px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary shadow-elevated">
            <Clock3 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Ponto Certo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle de ponto de funcionários
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-elevated">
          <Tabs defaultValue="entrar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="criar">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar" className="mt-5">
              <form className="space-y-4" onSubmit={entrar}>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={enviando}>
                  {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar" className="mt-5">
              <form className="space-y-4" onSubmit={cadastrar}>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    autoComplete="name"
                    placeholder="Maria da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-cadastro">E-mail</Label>
                  <Input
                    id="email-cadastro"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha-cadastro">Senha</Label>
                  <Input
                    id="senha-cadastro"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo de 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={enviando}>
                  {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {erro ? (
            <p role="alert" className="mt-4 text-sm font-medium text-destructive">
              {erro}
            </p>
          ) : null}
          {aviso ? <p className="mt-4 text-sm font-medium text-primary">{aviso}</p> : null}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Novas contas entram como funcionário. O acesso administrativo é concedido pela empresa.
        </p>
      </div>
    </div>
  );
}
