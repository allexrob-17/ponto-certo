import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "funcionario";

export interface Profile {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  created_at: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<{ error: string | null }>;
  signUp: (
    nome: string,
    email: string,
    senha: string,
  ) => Promise<{ error: string | null; precisaConfirmar: boolean }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarDados(userId: string) {
    const [{ data: perfil }, { data: papeis }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, nome, email, ativo, created_at")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);

    setProfile(perfil ?? null);
    const lista = (papeis ?? []).map((p) => p.role as AppRole);
    setRole(lista.includes("admin") ? "admin" : (lista[0] ?? null));
  }

  useEffect(() => {
    let ativo = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      if (!ativo) return;
      setSession(novaSessao);
      if (novaSessao?.user) {
        setTimeout(() => {
          void carregarDados(novaSessao.user.id);
        }, 0);
      } else {
        setProfile(null);
        setRole(null);
      }
    });

    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!ativo) return;
      setSession(data.session);
      if (data.session?.user) await carregarDados(data.session.user.id);
      setLoading(false);
    })();

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role,
      isAdmin: role === "admin",
      loading,
      signIn: async (email, senha) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        return { error: error ? traduzErro(error.message) : null };
      },
      signUp: async (nome, email, senha) => {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome: nome.trim() },
          },
        });
        return {
          error: error ? traduzErro(error.message) : null,
          precisaConfirmar: !error && !data.session,
        };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setRole(null);
        setSession(null);
      },
      refresh: async () => {
        if (session?.user) await carregarDados(session.user.id);
      },
    }),
    [session, profile, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function traduzErro(mensagem: string) {
  if (mensagem.includes("Invalid login credentials")) return "E-mail ou senha inválidos.";
  if (mensagem.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (mensagem.includes("User already registered")) return "Este e-mail já está cadastrado.";
  if (mensagem.includes("Password should be")) return "A senha deve ter no mínimo 6 caracteres.";
  return "Não foi possível concluir. Tente novamente.";
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
