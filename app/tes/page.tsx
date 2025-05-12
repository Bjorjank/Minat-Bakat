import { prisma } from "@/lib/prisma";
import ClientTes from "./ClientTes";

export default async function TesPage() {
  const questions = await prisma.question.findMany();

  // Kirim data ke komponen client
  return <ClientTes questions={questions} />;
}
