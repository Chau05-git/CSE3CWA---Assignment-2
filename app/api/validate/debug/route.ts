import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/validate/debug
 * Validate debug image selection for stage 3
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedId } = body;

    // Validate input
    if (!selectedId || typeof selectedId !== "string") {
      return NextResponse.json(
        { error: "Selected image ID is required" },
        { status: 400 }
      );
    }

    // Correct answers for debug challenge
    const correctAnswers = ["bug", "breakpoint"];
    const isCorrect = correctAnswers.includes(selectedId);

    // All options for feedback
    const options = {
      console: { label: "Console", isCorrect: false },
      bug: { label: "Bug Icon", isCorrect: true },
      play: { label: "Play Button", isCorrect: false },
      save: { label: "Save Icon", isCorrect: false },
      terminal: { label: "Terminal", isCorrect: false },
      breakpoint: { label: "Breakpoint", isCorrect: true },
    };

    const selectedOption = options[selectedId as keyof typeof options];

    if (!selectedOption) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const validationResult = {
      correct: isCorrect,
      selectedId,
      selectedLabel: selectedOption.label,
      message: isCorrect
        ? `✅ Correct! "${selectedOption.label}" is a debugging tool!`
        : `❌ Wrong! "${selectedOption.label}" is not used for debugging.`,
      hint: isCorrect ? null : "Look for tools that help you find and fix bugs in code",
      correctAnswers: correctAnswers.map(id => ({
        id,
        label: options[id as keyof typeof options].label,
      })),
    };

    return NextResponse.json({
      success: true,
      data: validationResult,
    });
  } catch (error) {
    console.error("Error validating debug selection:", error);
    return NextResponse.json(
      { error: "Failed to validate selection" },
      { status: 500 }
    );
  }
}
