// app/api/soal/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Tambah soal
export async function POST(req: Request) {
  const { text, trait } = await req.json();

  if (!text || !trait) {
    return NextResponse.json({ success: false, message: "Text dan trait wajib diisi." }, { status: 400 });
  }

  const newQuestion = await prisma.question.create({
    data: { text, trait },
  });

  return NextResponse.json({ success: true, question: newQuestion });
}

// Ambil semua soal
export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(questions);
}
