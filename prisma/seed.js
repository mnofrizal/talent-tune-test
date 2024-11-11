const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function main() {
  console.log("Start seeding...");

  // Create users with different roles and comprehensive details
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        phone: "+62 812-3456-7890",
        password: await hashPassword("admin123"),
        name: "Admin User",
        nip: "198001012010121001",
        role: "ADMINISTRATOR",
        jabatan: "MANAGER SINTANG POWER GENERATION UNIT",
        bidang: "Manajemen Strategis",
      },
    }),
    prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        phone: "+62 811-2345-6789",
        password: await hashPassword("user123"),
        name: "John Doe",
        nip: "199002022011122002",
        role: "USER",
        jabatan: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 2 (D) BLT POMU",
        bidang: "Operasi Teknis",
      },
    }),
    prisma.user.upsert({
      where: { email: "evaluator@example.com" },
      update: {},
      create: {
        email: "evaluator@example.com",
        phone: "+62 813-4567-8901",
        password: await hashPassword("evaluator123"),
        name: "Jane Smith",
        nip: "197903032009123003",
        role: "EVALUATOR",
        jabatan: "ASSISTANT MANAGER PENGADAAN BARANG DAN JASA UNIT 1-4 SLA PGU",
        bidang: "Pengadaan dan Logistik",
      },
    }),
    prisma.user.upsert({
      where: { email: "manager1@example.com" },
      update: {},
      create: {
        email: "manager1@example.com",
        phone: "+62 814-5678-9012",
        password: await hashPassword("manager123"),
        name: "Michael Johnson",
        nip: "197505051998031004",
        role: "ADMINISTRATOR",
        jabatan: "KEPALA SATUAN PROJECT MANAGEMENT",
        bidang: "Manajemen Proyek",
      },
    }),
    prisma.user.upsert({
      where: { email: "technician1@example.com" },
      update: {},
      create: {
        email: "technician1@example.com",
        phone: "+62 815-6789-0123",
        password: await hashPassword("tech123"),
        name: "Emily Brown",
        nip: "199203032015122005",
        role: "USER",
        jabatan: "JUNIOR TECHNICIAN OPERASI CONTROL ROOM UNIT 1 (A) BLB PGU",
        bidang: "Operasi Pembangkit",
      },
    }),
    prisma.user.upsert({
      where: { email: "evaluator2@example.com" },
      update: {},
      create: {
        email: "evaluator2@example.com",
        phone: "+62 816-7890-1234",
        password: await hashPassword("eval123"),
        name: "David Wilson",
        nip: "198206062012121006",
        role: "EVALUATOR",
        jabatan: "OFFICER KNOWLEDGE MANAGEMENT DAN INOVASI SLA PGU",
        bidang: "Pengembangan Pengetahuan",
      },
    }),
  ]);

  // Create sample assessments with evaluators and participants
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        judul: "Assessment untuk Manager SDM",
        materi: "Profil Bidang UMUM",
        metodePelaksanaan: "offline",
        ruangan: "Ruang Meeting 1",
        notaDinas: "ND-001/SDM/2024",
        evaluators: {
          create: [
            {
              user: {
                connect: { email: "evaluator@example.com" },
              },
            },
            {
              user: {
                connect: { email: "evaluator2@example.com" },
              },
            },
          ],
        },
        participants: {
          create: [
            {
              schedule: new Date("2024-03-20T09:00:00"),
              user: {
                connect: { email: "technician1@example.com" },
              },
              status: "SCHEDULED",
            },
            {
              schedule: new Date("2024-03-20T13:00:00"),
              user: {
                connect: { email: "user@example.com" },
              },
              status: "SCHEDULED",
            },
          ],
        },
      },
    }),
    prisma.assessment.create({
      data: {
        judul: "Assessment untuk Supervisor Teknik",
        materi: "Kompetensi Teknikal",
        metodePelaksanaan: "online",
        linkOnline: "https://meet.google.com/xyz",
        notaDinas: "ND-002/TEK/2024",
        evaluators: {
          create: [
            {
              user: {
                connect: { email: "evaluator2@example.com" },
              },
            },
          ],
        },
        participants: {
          create: [
            {
              schedule: new Date("2024-03-21T10:00:00"),
              user: {
                connect: { email: "user@example.com" },
              },
              status: "SCHEDULED",
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);
  console.log(`Created ${assessments.length} assessments`);
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
