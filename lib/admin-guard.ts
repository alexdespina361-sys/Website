import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isUserAdmin } from "@/lib/authz";

export async function requireAdminUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, authorized: false, status: 401 as const };
  }

  const authorized = await isUserAdmin(user, supabase);

  return {
    user,
    authorized,
    status: authorized ? (200 as const) : (403 as const),
  };
}
