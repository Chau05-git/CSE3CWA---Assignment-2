import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/challenges
 * Get all challenge information for the Escape Room game
 */
export async function GET(req: NextRequest) {
  try {
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
        examples: [
          {
            title: "Using 'sum'",
            code: `for (let i = 0; i <= 10; i++) {
  sum = sum + i;
}`,
          },
          {
            title: "Using 'total'",
            code: `let total = 0;
for (let x = 0; x <= 10; x++) {
  total += x;
}
console.log(total);`,
          },
        ],
      },
      {
        stage: 2,
        id: "dataport-challenge",
        title: "Port Data to localStorage",
        emoji: "💾",
        description: "Save the user object to localStorage with key 'userData'",
        hint: "You can use any variable names you want! Just save the correct data.",
        starterCode: `// Save user data to localStorage
// We have a user object that needs to be stored

const user = {
  name: "John",
  age: 25,
  city: "NYC"
};

// TODO: Save this object to localStorage with key "userData"
// Hint: Use localStorage.setItem()
// Remember: localStorage only stores strings, so use JSON.stringify()

// Your code here:



// Check if saved correctly
const saved = localStorage.getItem("userData");
console.log("Saved data:", saved);`,
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
        examples: [
          {
            title: "With variable",
            code: `const userString = JSON.stringify(user);
localStorage.setItem("userData", userString);`,
          },
          {
            title: "Direct (1 line)",
            code: `localStorage.setItem("userData", JSON.stringify(user));`,
          },
        ],
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

    return NextResponse.json({
      success: true,
      data: {
        challenges,
        totalStages: challenges.length,
      },
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}
