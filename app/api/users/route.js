import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Initialize Prisma client with logging
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-change-it"
);

// Token verification utility
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function GET(request) {
  try {
    // Verify user authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      console.error("No authentication token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      console.error("Invalid token payload");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search") || "";

    console.log("Fetch users params:", { role, search });

    // Prepare filter conditions
    const whereCondition = {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { nip: { contains: search, mode: "insensitive" } },
              { jabatan: { contains: search, mode: "insensitive" } },
              { bidang: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    console.log("Where condition:", JSON.stringify(whereCondition, null, 2));

    // Fetch users
    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        nip: true,
        role: true,
        jabatan: true,
        bidang: true,
      },
      take: 50, // Limit results
    });

    console.log("Fetched users:", users.length);

    return NextResponse.json(users);
  } catch (error) {
    console.error("FULL Users fetch error:", error);

    // Log the full error details
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        fullError: error,
      },
      { status: 500 }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting Prisma:", disconnectError);
    }
  }
}

// User creation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  nip: z.string().optional(),
  role: z.string().optional(),
  jabatan: z.string().optional(),
  bidang: z.string().optional(),
});

export async function POST(request) {
  try {
    // Verify user authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log("Request body:", body); // Log the request body for debugging
    const userData = userSchema.parse(body);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user in the database
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
