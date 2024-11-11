import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function authenticateRequest(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { error: "Invalid token", status: 401 };
  }

  return { payload };
}

export async function GET(request, context) {
  try {
    // Authentication
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { payload } = auth;

    // Extract id from context
    const { params } = await context;
    const assessmentId = params.id;

    // Fetch the specific assessment
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
      include: {
        evaluators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                nip: true,
                jabatan: true,
                bidang: true,
              },
            },
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                nip: true,
                jabatan: true,
                bidang: true,
              },
            },
          },
        },
      },
    });

    // Check if assessment exists
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Additional authorization check
    const isUserParticipant = assessment.participants.some(
      (p) => p.userId === payload.userId
    );
    const isUserEvaluator = assessment.evaluators.some(
      (e) => e.userId === payload.userId
    );

    // if (
    //   !isUserParticipant &&
    //   !isUserEvaluator &&
    //   payload.role !== "ADMINISTRATOR"
    // ) {
    //   return NextResponse.json(
    //     { error: "Unauthorized to view this assessment" },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json(assessment, { status: 200 });
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment details" },
      { status: 500 }
    );
  }
}
