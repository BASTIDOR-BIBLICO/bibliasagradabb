import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        if (mounted) { setIsAdmin(false); setLoading(false); }
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (mounted) {
        setIsAdmin(!error && data === true);
        setLoading(false);
      }
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(check);
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  return { isAdmin, loading };
}
