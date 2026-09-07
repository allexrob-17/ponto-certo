import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { CalendarClock, Home, UserRound } from "lucide-react";

import { AppLayout, type NavItem } from "@/components/layout/AppLayout";
import { PageSection, PlaceholderArea } from "@/components/layout/PageSection";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/painel")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Meu painel | Ponto Certo" },
      {
        name: "description",
        content: "Painel do funcionário para acompanhar a jornada de trabalho no Ponto Certo.",
      },
      { property: "og:title", content: "Meu painel | Ponto Certo" },
      {
        property: "og:description",
        content: "Painel do funcionário para acompanhar a jornada de trabalho.",
      },
    ],
  }),
  component: PainelFuncionario,
});

export const navFuncionario: NavItem[] = [
  { label: "Início", to: "/painel", icon: Home },
  { label: "Minha conta", to: "/conta", icon: UserRound },
];

function PainelFuncionario() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate({ to: "/admin", replace: true });
  }, [isAdmin, navigate]);

  const primeiroNome = (profile?.nome || "").split(" ")[0];

  return (
    <AppLayout
      titulo={profile?.nome || "Funcionário"}
      subtitulo="Área do funcionário"
      itens={navFuncionario}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Olá{primeiroNome ? `, ${primeiroNome}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Este é o seu espaço de trabalho no Ponto Certo.
          </p>
        </div>

        <PageSection
          titulo="Registro de ponto"
          descricao="Em breve você poderá registrar sua entrada e saída por aqui."
        >
          <PlaceholderArea texto="O botão de registrar ponto será disponibilizado nesta área." />
        </PageSection>

        <PageSection
          titulo="Meus registros"
          descricao="Seu histórico de marcações aparecerá nesta seção."
        >
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
            <CalendarClock className="h-5 w-5 shrink-0" />
            <span>Nenhuma funcionalidade de histórico ativa nesta etapa.</span>
          </div>
        </PageSection>
      </div>
    </AppLayout>
  );
}
