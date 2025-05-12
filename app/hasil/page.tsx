// app/hasil/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import HasilClient from "./HasilClient";

interface Props {
  searchParams: { id?: string };
}

export default async function HasilPage({ searchParams }: Props) {
  const sessionId = searchParams.id;
  if (!sessionId) return <div>Session ID tidak ditemukan.</div>;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return notFound();

  const results = await prisma.result.findMany({
    where: { userId: session.userId },
  });

  return <HasilClient session={session} results={results} />;
}
