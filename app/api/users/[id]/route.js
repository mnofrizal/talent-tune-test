import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Initialize Prisma client
const prisma = new PrismaClient();

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
    return null;
  }
}

// Password hashing utility
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Validation schema for user update
const userUpdateSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    nip: z.string().optional(),
    role: z.enum(["ADMINISTRATOR", "USER", "EVALUATOR"]).optional(),
    jabatan: z.string().optional(),
    bidang: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export async function DELETE(request, { params }) {
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

    const userId = parseInt(params.id);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting the last administrator
    const adminCount = await prisma.user.count({
      where: { role: "ADMINISTRATOR" },
    });

    if (existingUser.role === "ADMINISTRATOR" && adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last administrator" },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete user", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
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

    const userId = parseInt(params.id);
    const userData = await request.json();

    // Validate input
    try {
      userUpdateSchema.parse(userData);
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationError.errors,
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = { ...userData };

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
