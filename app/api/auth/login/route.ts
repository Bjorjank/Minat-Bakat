import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../lib/prisma"; // Sesuaikan path import dengan file prisma kamu

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: "Email tidak ditemukan" }, { status: 404 });
  }

  // Verifikasi password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ success: false, message: "Password salah" }, { status: 400 });
  }

  // Buat token JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return NextResponse.json({ success: true, token });
}
