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

export async function GET(request) {
  try {
    // Authentication
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { payload } = auth;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");

    // Build filter conditions
    const where = {
      participants: {
        some: {}, // Initialize the some object for participants
      },
    };

    // Add status filter if provided
    if (status && status !== "All") {
      where.participants.some.status = status;
    }

    // Add role-based filters
    if (payload.role === "USER") {
      where.participants.some.userId = payload.userId;
    } else if (payload.role === "EVALUATOR") {
      where.evaluators = {
        some: {
          userId: payload.userId,
        },
      };
    }

    // Fetch assessments with pagination
    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.assessment.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: assessments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Authentication
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { payload } = auth;

    // Only admin can create assessments
    if (payload.role !== "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Only administrators can create assessments" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const data = await request.json();
    const {
      judul,
      materi,
      metodePelaksanaan,
      ruangan,
      linkOnline,
      notaDinas,
      evaluators,
      participants,
    } = data;

    // Validation
    if (!judul || !materi || !metodePelaksanaan) {
      return NextResponse.json(
        {
          error: "Required fields missing",
          details: "judul, materi, and metodePelaksanaan are required",
        },
        { status: 400 }
      );
    }

    // Validate methodology and related fields
    if (metodePelaksanaan === "offline" && !ruangan) {
      return NextResponse.json(
        {
          error: "Room is required for offline assessments",
        },
        { status: 400 }
      );
    }

    if (metodePelaksanaan === "online" && !linkOnline) {
      return NextResponse.json(
        {
          error: "Meeting link is required for online assessments",
        },
        { status: 400 }
      );
    }

    // Validate evaluators and participants
    if (!evaluators?.length || !participants?.length) {
      return NextResponse.json(
        {
          error: "At least one evaluator and one participant are required",
        },
        { status: 400 }
      );
    }

    // Create assessment with relations
    const newAssessment = await prisma.assessment.create({
      data: {
        judul,
        materi,
        metodePelaksanaan,
        ruangan,
        linkOnline,
        notaDinas,
        evaluators: {
          create: evaluators.map((evaluatorId) => ({
            userId: evaluatorId,
          })),
        },
        participants: {
          create: participants.map(({ userId, schedule }) => ({
            userId,
            schedule: new Date(schedule),
            status: "SCHEDULED", // Set initial status
          })),
        },
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

    return NextResponse.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error("Assessment creation error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Duplicate entry found",
          details: error.meta?.target || error.message,
        },
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "Referenced record not found",
          details: error.meta?.cause || error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create assessment" },
      { status: 500 }
    );
  }
}
