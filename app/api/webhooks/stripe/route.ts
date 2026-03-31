import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Plata cu cardul este dezactivata pentru acest magazin." },
    { status: 410 }
  );
}
