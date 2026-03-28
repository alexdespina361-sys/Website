import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/admin-guard";

async function assertAdmin() {
  const adminAccess = await requireAdminUser();

  if (!adminAccess.authorized) {
    return NextResponse.json(
      { error: adminAccess.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: adminAccess.status }
    );
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deniedResponse = await assertAdmin();

  if (deniedResponse) {
    return deniedResponse;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const deniedResponse = await assertAdmin();

  if (deniedResponse) {
    return deniedResponse;
  }

  const body = await request.json();
  const { fulfillment_status, status } = body;

  const updateData: Record<string, string> = {
    updated_at: new Date().toISOString(),
  };

  if (fulfillment_status) updateData.fulfillment_status = fulfillment_status;
  if (status) updateData.status = status;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
