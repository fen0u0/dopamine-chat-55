import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { validateAlias } from "@/lib/chat";

export type AliasStatus = "idle" | "checking" | "available" | "taken" | "invalid";

/**
 * Debounced, case-insensitive alias availability check.
 * Your own current alias always counts as available.
 */
export function useAliasCheck(alias: string, myId?: string) {
  const [status, setStatus] = useState<AliasStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const v = validateAlias(alias);
    if (v) {
      setStatus("invalid");
      setMessage(v);
      return;
    }
    setStatus("checking");
    setMessage(null);
    let cancelled = false;
    const t = setTimeout(async () => {
      // ilike without wildcards = case-insensitive exact match; escape _ and %
      const pattern = alias.replace(/[\\%_]/g, (c) => `\\${c}`);
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", pattern)
        .limit(1);
      if (cancelled) return;
      if (error) {
        setStatus("idle");
        return;
      }
      const other = (data ?? []).find((r) => r.id !== myId);
      setStatus(other ? "taken" : "available");
      setMessage(other ? "alias taken, roll again 🎲" : null);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [alias, myId]);

  return { status, message };
}
