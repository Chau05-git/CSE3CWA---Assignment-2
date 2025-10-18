import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint
 */
export async function GET(req: NextRequest) {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
