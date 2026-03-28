import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/admin-guard";

export async function GET() {
  const adminAccess = await requireAdminUser();

  if (!adminAccess.authorized) {
    return NextResponse.json(
      { error: adminAccess.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: adminAccess.status }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
