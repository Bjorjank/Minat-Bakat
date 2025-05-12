// app/api/register-murid/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt"; // atau sistem autentikasi yang kamu gunakan

export async function POST(req: Request) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "GURU") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Ambil sekolah guru dari token
    const guru = await prisma.user.findUnique({
      where: { id: token.id },
      select: { schoolId: true },
    });

    if (!guru || !guru.schoolId) {
      return NextResponse.json({ error: "Guru tidak memiliki sekolah terdaftar" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const murid = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "USER",
        schoolId: guru.schoolId,
      },
    });

    return NextResponse.json({ success: true, murid });
  } catch (err) {
    console.error("Gagal membuat akun murid:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
