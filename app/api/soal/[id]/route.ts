// app/api/soal/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan prisma diimport dengan benar

// Mengambil data soal berdasarkan ID (GET)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const question = await prisma.question.findUnique({
    where: { id: params.id },
  });

  if (!question) {
    return NextResponse.json({ success: false, message: "Soal tidak ditemukan!" }, { status: 404 });
  }

  return NextResponse.json(question);
}

// Memperbarui soal berdasarkan ID (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { text, trait } = await req.json();

  // Pastikan kita menunggu params.id agar bisa digunakan
  const updatedQuestion = await prisma.question.update({
    where: { id: params.id }, // Harus menunggu params sebelum mengaksesnya
    data: { text, trait },
  });

  return NextResponse.json({ success: true, updatedQuestion });
}

// Menghapus soal berdasarkan ID (DELETE)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Menunggu params.id
  const { id } = await params; // Tambahkan await untuk menunggu params

  // Menghapus soal
  await prisma.question.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Soal berhasil dihapus!" });
}
