// app/api/guru-login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Cek apakah guru ada di database
  const guru = await prisma.guru.findUnique({
    where: { username },
  });

  if (!guru) {
    return NextResponse.json({ success: false, message: "Username tidak ditemukan!" }, { status: 404 });
  }

  // Verifikasi password
  const isValidPassword = await bcrypt.compare(password, guru.password);

  if (!isValidPassword) {
    return NextResponse.json({ success: false, message: "Password salah!" }, { status: 401 });
  }

  // Buat JWT Token
  const token = jwt.sign({ id: guru.id, username: guru.username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

  return NextResponse.json({
    success: true,
    message: "Login berhasil!",
    token,
  });
}
