import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface AppLayoutProps {
  titulo: string;
  subtitulo?: string;
  itens: NavItem[];
  children: ReactNode;
}

export function AppLayout({ titulo, subtitulo, itens, children }: AppLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const iniciais = (profile?.nome || profile?.email || "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  async function sair() {
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-card/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {iniciais}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{titulo}</p>
              {subtitulo ? (
                <p className="truncate text-xs text-muted-foreground">{subtitulo}</p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-1 sm:flex">
              {itens.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.to && "bg-accent text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button variant="ghost" size="icon" aria-label="Sair" onClick={sair}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 sm:pb-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-5xl items-stretch">
          {itens.map((item) => {
            const ativo = pathname === item.to;
            const Icone = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  ativo ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icone className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
