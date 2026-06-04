import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";

function getStore_() {
  return getStore({ name: "pins", consistency: "strong" });
}

export async function GET() {
  try {
    const store = getStore_();
    const raw = await store.get("pins.json");
    if (!raw) return NextResponse.json([]);
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pin = await req.json();
  const store = getStore_();
  const raw = await store.get("pins.json");
  const pins = raw ? JSON.parse(raw) : [];
  const newPin = { ...pin, id: Date.now().toString() };
  pins.push(newPin);
  await store.set("pins.json", JSON.stringify(pins));
  return NextResponse.json(newPin);
}

export async function DELETE(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const store = getStore_();
  const raw = await store.get("pins.json");
  const pins = raw ? JSON.parse(raw) : [];
  const updated = pins.filter((p: { id: string }) => p.id !== id);
  await store.set("pins.json", JSON.stringify(updated));
  return NextResponse.json({ ok: true });
}
