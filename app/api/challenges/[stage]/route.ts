import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/challenges/[stage]
 * Get specific challenge information by stage number
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stage: string }> }
) {
  try {
    const { stage } = await params;
    const stageNum = parseInt(stage);

    // Validate stage number
    if (isNaN(stageNum) || stageNum < 1 || stageNum > 3) {
      return NextResponse.json(
        { error: "Invalid stage number. Must be 1, 2, or 3" },
        { status: 400 }
      );
    }

    // Challenge data
    const challenges = [
      {
        stage: 1,
        id: "sum-challenge",
        title: "Calculate Sum",
        emoji: "🧮",
        description: "Calculate the sum of numbers from 0 to 10",
        hint: "You can use any variable names! Just print the correct result (55)",
        starterCode: `// Calculate sum from 0 to 10
let sum = 0;

// TODO: Add your loop here
// Hint: for (let i = 0; i <= 10; i++) { ... }


console.log(sum);`,
        expectedOutput: 55,
        validation: {
          type: "number",
          acceptedValues: [55],
        },
      },
      {
        stage: 2,
        id: "dataport-challenge",
        title: "Port Data to localStorage",
        emoji: "💾",
        description: "Save the user object to localStorage with key 'userData'",
        hint: "You can use any variable names you want! Just save the correct data.",
        starterCode: `// Save user data to localStorage
const user = { name: "John", age: 25, city: "NYC" };

// TODO: Save this object to localStorage with key "userData"
// Your code here:`,
        expectedData: {
          name: "John",
          age: 25,
          city: "NYC",
        },
        validation: {
          type: "localStorage",
          key: "userData",
          format: "JSON",
        },
      },
      {
        stage: 3,
        id: "debug-challenge",
        title: "Debug Tool",
        emoji: "🐛",
        description: "Click the image that allows you to debug code",
        hint: "Debugging tools help you find and fix bugs in your code",
        options: [
          { id: "console", emoji: "🖥️", label: "Console", isCorrect: false },
          { id: "bug", emoji: "🐛", label: "Bug Icon", isCorrect: true },
          { id: "play", emoji: "▶️", label: "Play Button", isCorrect: false },
          { id: "save", emoji: "💾", label: "Save Icon", isCorrect: false },
          { id: "terminal", emoji: "⌨️", label: "Terminal", isCorrect: false },
          { id: "breakpoint", emoji: "🔴", label: "Breakpoint", isCorrect: true },
        ],
        validation: {
          type: "selection",
          correctAnswers: ["bug", "breakpoint"],
        },
      },
    ];

    const challenge = challenges[stageNum - 1];

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
