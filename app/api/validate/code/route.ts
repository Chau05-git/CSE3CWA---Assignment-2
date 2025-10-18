import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/validate/code
 * Validate code execution for SumChallenge and DataPortChallenge
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stage, code, output } = body;

    // Validate input
    if (!stage || typeof stage !== "number") {
      return NextResponse.json(
        { error: "Valid stage number is required" },
        { status: 400 }
      );
    }

    if (stage < 1 || stage > 2) {
      return NextResponse.json(
        { error: "Code validation only for stages 1-2" },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    let validationResult;

    // Stage 1: Sum Challenge
    if (stage === 1) {
      const correctAnswer = 55;
      
      // Parse output for numbers
      const numbers = String(output)
        .split('\n')
        .map(line => parseInt(line.trim()))
        .filter(num => !isNaN(num));

      const isCorrect = numbers.includes(correctAnswer);

      validationResult = {
        correct: isCorrect,
        expectedOutput: correctAnswer,
        actualOutput: numbers[0] || null,
        message: isCorrect
          ? "✅ Correct! The answer is 55"
          : `❌ Wrong answer! You got ${numbers[0] || 'no output'}, expected ${correctAnswer}`,
        hint: isCorrect ? null : "0+1+2+3+4+5+6+7+8+9+10 = ?",
      };
    }
    // Stage 2: DataPort Challenge
    else if (stage === 2) {
      const expectedData = {
        name: "John",
        age: 25,
        city: "NYC",
      };

      try {
        const savedData = JSON.parse(output);
        const isCorrect =
          savedData.name === expectedData.name &&
          savedData.age === expectedData.age &&
          savedData.city === expectedData.city;

        validationResult = {
          correct: isCorrect,
          expectedData,
          actualData: savedData,
          message: isCorrect
            ? "✅ Perfect! Data saved to localStorage successfully!"
            : "❌ Data saved but values are wrong!",
          hint: isCorrect ? null : "Make sure to use JSON.stringify() and save with key 'userData'",
        };
      } catch (e) {
        validationResult = {
          correct: false,
          expectedData,
          actualData: null,
          message: "❌ Data saved but not in JSON format!",
          hint: "Use JSON.stringify() before saving to localStorage",
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: validationResult,
    });
  } catch (error) {
    console.error("Error validating code:", error);
    return NextResponse.json(
      { error: "Failed to validate code" },
      { status: 500 }
    );
  }
}
