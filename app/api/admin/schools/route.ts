// app/api/admin/schools/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function verifySuperadmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.role === "SUPERADMIN" ? payload : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const schools = await prisma.school.findMany({
    include: { users: { select: { role: true } } },
  });
  return NextResponse.json(schools);
}

export async function POST(req: NextRequest) {
  const auth = verifySuperadmin(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Nama sekolah wajib diisi" }, { status: 400 });

  const exists = await prisma.school.findUnique({ where: { name } });
  if (exists) return NextResponse.json({ error: "Sekolah sudah ada" }, { status: 409 });

  const school = await prisma.school.create({ data: { name } });
  return NextResponse.json({ success: true, school });
}

export async function PUT(req: NextRequest) {
  const auth = verifySuperadmin(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id, name } = await req.json();
  if (!id || !name) return NextResponse.json({ error: "ID dan nama baru wajib diisi" }, { status: 400 });

  const updated = await prisma.school.update({ where: { id }, data: { name } });
  return NextResponse.json({ success: true, updated });
}

export async function DELETE(req: NextRequest) {
  const auth = verifySuperadmin(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID sekolah wajib dikirim" }, { status: 400 });

  await prisma.school.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
