// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database baru...");

  // Hapus data lama (urutan penting karena constraint relasi)
  await prisma.result.deleteMany();
  await prisma.session.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // Buat Superadmin (tanpa sekolah)
  const superadmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@mbti.com",
      password: await bcrypt.hash("supersecure", 10),
      role: "SUPERADMIN",
    },
  });

  // Buat sekolah
  const sman1 = await prisma.school.create({
    data: {
      name: "SMA Negeri 1 Contoh",
    },
  });

  // Buat Guru (terkait dengan sekolah)
  const guruA = await prisma.user.create({
    data: {
      name: "Guru A",
      email: "gurua@sman1.com",
      password: await bcrypt.hash("guru123", 10),
      role: "GURU",
      schoolId: sman1.id,
    },
  });

  // Buat murid terkait guru/sekolah
  const murid1 = await prisma.user.create({
    data: {
      name: "Murid 1",
      email: "murid1@sman1.com",
      password: await bcrypt.hash("murid123", 10),
      role: "USER",
      schoolId: sman1.id,
    },
  });

  const murid2 = await prisma.user.create({
    data: {
      name: "Murid 2",
      email: "murid2@sman1.com",
      password: await bcrypt.hash("murid123", 10),
      role: "USER",
      schoolId: sman1.id,
    },
  });

  // Tambahkan soal untuk sekolah tsb
  await prisma.question.createMany({
    data: [
      { text: "Saya lebih nyaman bekerja sendiri.", trait: "introvert", schoolId: sman1.id },
      { text: "Saya suka keramaian dan diskusi.", trait: "extrovert", schoolId: sman1.id },
      { text: "Saya membuat keputusan dengan logika.", trait: "thinking", schoolId: sman1.id },
      { text: "Saya mempertimbangkan perasaan orang lain.", trait: "feeling", schoolId: sman1.id },
    ],
  });

  // Buat session & result dummy untuk satu murid
  const session = await prisma.session.create({
    data: {
      userId: murid1.id,
      answers: [1, -1, 1, -1],
      resultType: "INTP",
    },
  });

  await prisma.result.createMany({
    data: [
      { userId: murid1.id, trait: "introvert", score: 3 },
      { userId: murid1.id, trait: "thinking", score: 2 },
      { userId: murid1.id, trait: "feeling", score: -1 },
      { userId: murid1.id, trait: "extrovert", score: -2 },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
