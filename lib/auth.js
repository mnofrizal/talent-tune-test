import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-change-it"
);

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  // Don't include password in the token
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Helper function to check if user has required role
export async function checkUserRole(userId, allowedRoles) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

// Helper function to hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Helper function to create initial admin user
export async function createInitialAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMINISTRATOR" },
    });

    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123");
      await prisma.user.create({
        data: {
          email: "admin@example.com",
          password: hashedPassword,
          name: "Admin User",
          role: "ADMINISTRATOR",
        },
      });
      console.log("Initial admin user created");
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
  }
}
