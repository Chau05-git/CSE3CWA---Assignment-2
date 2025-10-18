"use client";
import { useState } from "react";
import "./Challenge.css";

type Props = {
  onComplete: () => void;
};

export default function SumChallenge({ onComplete }: Props) {
  const [code, setCode] = useState(`// Calculate sum from 0 to 10
let sum = 0;

// TODO: Add your loop here
// Hint: for (let i = 0; i <= 10; i++) { ... }


console.log(sum);
`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  
  const correctAnswer = 55;

  const handleRunCode = () => {
    setError("");
    setOutput("");
    
    try {
      let capturedOutput = "";
      const originalLog = console.log;
      // Ensure console.log is always restored even if eval throws
      try {
        console.log = (...args: any[]) => {
          capturedOutput += args.join(" ") + "\n";
        };
        // Execute user code in a controlled scope
        eval(code);
      } finally {
        console.log = originalLog;
      }
      
      // Lấy tất cả số được in ra
      const numbers = capturedOutput.trim().split('\n')
        .map(line => parseInt(line.trim()))
        .filter(num => !isNaN(num));
      
      // Kiểm tra có số 55 trong output không (không quan tâm tên biến)
      if (numbers.includes(correctAnswer)) {
        setOutput(`✅ Correct! The answer is ${correctAnswer}\n\n✨ Your code works perfectly!`);
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else if (numbers.length > 0) {
        setError(`❌ Wrong answer! You got ${numbers[0]}, expected ${correctAnswer}\n\nHint: 0+1+2+3+4+5+6+7+8+9+10 = ?`);
      } else {
        setError(`❌ No output detected!\n\nMake sure to use console.log() to print the result`);
      }
      
    } catch (err: any) {
      setError(`❌ Error: ${err.message}\n\nCheck your code syntax!`);
    }
  };

  return (
    <div className="challenge-overlay">
      <div className="challenge-container">
        <h2>🧮 Challenge 1: Calculate Sum</h2>
        <p className="challenge-desc">
          Calculate the sum of numbers from <strong>0 to 10</strong>
        </p>
        <p className="hint">
          💡 You can use any variable names! Just print the correct result (55)
        </p>

        <div style={{ 
          background: "rgba(59, 130, 246, 0.1)", 
          border: "1px solid #3b82f6",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          color: "#93c5fd"
        }}>
          <strong>Example Solutions:</strong>
          <pre style={{ margin: "8px 0 0 0", fontSize: 14 }}>{`// Option 1: Using 'sum'
for (let i = 0; i <= 10; i++) {
  sum = sum + i;
}

// Option 2: Using 'total'
let total = 0;
for (let x = 0; x <= 10; x++) {
  total += x;
}
console.log(total);

// Option 3: Any names you like!
let result = 0;
for (let num = 0; num <= 10; num++) {
  result = result + num;
}
console.log(result);`}</pre>
        </div>

        <div className="editor-section">
          <div className="editor-header">
            <span>📝 Code Editor</span>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>

        <button onClick={handleRunCode} className="run-button">
          ▶️ Run Code
        </button>

        {output && (
          <div className="output-section">
            <div className="output-header">📤 Output:</div>
            <pre className="output-content">{output}</pre>
          </div>
        )}

        {error && (
          <div className="error-section">
            <div className="error-header">❌ Error:</div>
            <pre className="error-content">{error}</pre>
          </div>
        )}

        <div className="challenge-footer">
          <p>Expected result: <code>55</code></p>
          <p style={{ fontSize: 12, marginTop: 4, color: "#94a3b8" }}>
            ✨ Any variable names work! sum, total, result, answer, etc.
          </p>
        </div>
      </div>
    </div>
  );
}