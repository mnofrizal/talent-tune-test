const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function main() {
  console.log("Start seeding...");

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { name: "Ruang Rapat 1" },
      update: {},
      create: {
        name: "Ruang Rapat 1",
        capacity: 20,
        location: "Lantai 2",
      },
    }),
    prisma.room.upsert({
      where: { name: "Ruang Rapat 2" },
      update: {},
      create: {
        name: "Ruang Rapat 2",
        capacity: 15,
        location: "Lantai 3",
      },
    }),
    prisma.room.upsert({
      where: { name: "Ruang Rapat 3" },
      update: {},
      create: {
        name: "Ruang Rapat 3",
        capacity: 10,
        location: "Lantai 4",
      },
    }),
  ]);

  // Create users with different roles
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        password: await hashPassword("admin123"),
        name: "Admin User",
        role: "ADMINISTRATOR",
        position: "MANAGER SINTANG POWER GENERATION UNIT",
      },
    }),
    prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        password: await hashPassword("user123"),
        name: "John Doe",
        role: "USER",
        position: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (D) BLT POMU",
      },
    }),
    prisma.user.upsert({
      where: { email: "evaluator@example.com" },
      update: {},
      create: {
        email: "evaluator@example.com",
        password: await hashPassword("evaluator123"),
        name: "Jane Smith",
        role: "EVALUATOR",
        position:
          "ASSISTANT MANAGER PENGADAAN BARANG DAN JASA UNIT 1-4 SLA PGU",
      },
    }),
  ]);

  // Create sample assessments
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        title: "Technical Skills Assessment",
        materi: "Evaluasi Kemampuan Teknis Operasi",
        method: "OFFLINE",
        status: "SCHEDULED",
        roomId: rooms[0].id,
        scheduledAt: new Date("2024-03-20T10:00:00Z"),
        candidates: {
          connect: [{ id: users[1].id }],
        },
        evaluators: {
          connect: [{ id: users[2].id }],
        },
      },
    }),
    prisma.assessment.create({
      data: {
        title: "Leadership Potential Review",
        materi: "Penilaian Potensi Kepemimpinan",
        method: "ONLINE",
        status: "SCHEDULED",
        virtualMeetingLink: "https://meet.example.com/leadership-assessment",
        scheduledAt: new Date("2024-03-22T14:00:00Z"),
        candidates: {
          connect: [{ id: users[1].id }],
        },
        evaluators: {
          connect: [{ id: users[2].id }],
        },
      },
    }),
  ]);

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
