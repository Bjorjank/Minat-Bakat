// pages/api/admin/sessions.ts
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return new Response(JSON.stringify(sessions));
}
