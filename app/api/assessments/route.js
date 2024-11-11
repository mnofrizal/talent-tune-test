import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // Verify user authentication
    const token = cookies().get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.materi || !data.method) {
      return NextResponse.json(
        { error: "Missing required assessment details" },
        { status: 400 }
      );
    }

    // Prepare assessment data
    const assessmentData = {
      title: data.title,
      materi: data.materi,
      method: data.method,
      status: "SCHEDULED",
      roomId: data.method === "offline" ? data.roomId : null,
      virtualMeetingLink:
        data.method === "online" ? data.virtualMeetingLink : null,
      documentPath: data.documentPath,
      scheduledAt: new Date(), // You might want to allow custom scheduling
    };

    // Create assessment with related users
    const newAssessment = await prisma.assessment.create({
      data: {
        ...assessmentData,
        evaluators: {
          connect: data.evaluators.map((evaluator) => ({ id: evaluator.id })),
        },
        candidates: {
          connect: data.candidates.map((candidate) => ({ id: candidate.id })),
        },
      },
      include: {
        evaluators: true,
        candidates: true,
      },
    });

    return NextResponse.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error("Assessment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create assessment", details: error.message },
      { status: 500 }
    );
  }
}
