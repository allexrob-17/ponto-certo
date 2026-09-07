import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageSection } from "@/components/layout/PageSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { navAdmin } from "./admin";
import { navFuncionario } from "./painel";

export const Route = createFileRoute("/_authenticated/conta")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Minha conta | Ponto Certo" },
      {
        name: "description",
        content: "Consulte os dados do seu cadastro e seu tipo de acesso no Ponto Certo.",
      },
      { property: "og:title", content: "Minha conta | Ponto Certo" },
      {
        property: "og:description",
        content: "Consulte os dados do seu cadastro e seu tipo de acesso.",
      },
    ],
  }),
  component: ContaPage,
});

function ContaPage() {
  const { profile, role, isAdmin, signOut } = useAuth();

  const criadoEm = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR")
    : "—";

  return (
    <AppLayout
      titulo={profile?.nome || "Minha conta"}
      subtitulo={isAdmin ? "Área administrativa" : "Área do funcionário"}
      itens={isAdmin ? navAdmin : navFuncionario}
    >
      <div className="space-y-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Minha conta</h1>

        <PageSection titulo="Dados do cadastro">
          <dl className="divide-y divide-border text-sm">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="truncate font-medium text-foreground">{profile?.nome || "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="truncate font-medium text-foreground">{profile?.email || "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Perfil</dt>
              <dd>
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {role === "admin" ? "Administrador" : "Funcionário"}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Situação</dt>
              <dd>
                <Badge variant={profile?.ativo ? "secondary" : "destructive"}>
                  {profile?.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">Criado em</dt>
              <dd className="font-medium text-foreground">{criadoEm}</dd>
            </div>
          </dl>
        </PageSection>

        <Button variant="outline" className="w-full" onClick={() => void signOut()}>
          Sair da conta
        </Button>
      </div>
    </AppLayout>
  );
}
