// app/api/sesi/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") || "";
  const tipe = searchParams.get("tipe");

  const where: any = {
    user: {
      OR: [{ name: { contains: keyword, mode: "insensitive" } }, { email: { contains: keyword, mode: "insensitive" } }],
    },
  };

  if (tipe) {
    where.resultType = tipe;
  }

  const sessions = await prisma.session.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return NextResponse.json(sessions);
}
