import type { SupabaseClient, User } from "@supabase/supabase-js";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function isUserAdmin(
  user: Pick<User, "id" | "email">,
  supabase: SupabaseClient
) {
  if (user.email && adminEmails.includes(user.email.toLowerCase())) {
    return true;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    return adminEmails.length === 0;
  }

  return data?.role === "admin";
}
