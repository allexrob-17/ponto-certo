import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, ShieldCheck, UserRound, Users } from "lucide-react";

import { AppLayout, type NavItem } from "@/components/layout/AppLayout";
import { PageSection, PlaceholderArea } from "@/components/layout/PageSection";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administração | Ponto Certo" },
      {
        name: "description",
        content:
          "Área administrativa do Ponto Certo para gerenciar funcionários e registros de ponto.",
      },
      { property: "og:title", content: "Administração | Ponto Certo" },
      {
        property: "og:description",
        content: "Área administrativa para gerenciar funcionários e registros de ponto.",
      },
    ],
  }),
  component: PainelAdmin,
});

export const navAdmin: NavItem[] = [
  { label: "Painel", to: "/admin", icon: LayoutDashboard },
  { label: "Minha conta", to: "/conta", icon: UserRound },
];

function PainelAdmin() {
  const { profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/painel", replace: true });
  }, [loading, isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <AppLayout
      titulo={profile?.nome || "Administrador"}
      subtitulo="Área administrativa"
      itens={navAdmin}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Painel administrativo
          </h1>
        </div>
        <p className="-mt-2 text-sm text-muted-foreground">
          Base preparada para o gerenciamento da equipe e dos registros de ponto.
        </p>

        <PageSection
          titulo="Funcionários"
          descricao="Aqui ficará a lista da equipe, com cadastro, edição e ativação de contas."
        >
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
            <Users className="h-5 w-5 shrink-0" />
            <span>Gerenciamento de funcionários será adicionado na próxima etapa.</span>
          </div>
        </PageSection>

        <PageSection
          titulo="Registros de ponto"
          descricao="Espaço reservado para acompanhar as marcações da equipe."
        >
          <PlaceholderArea texto="Os registros da equipe aparecerão nesta área." />
        </PageSection>
      </div>
    </AppLayout>
  );
}
