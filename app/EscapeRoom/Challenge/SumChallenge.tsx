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

  const handleRunCode = async () => {
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

      // Try server-side validation first; fallback locally if it fails
      try {
        const res = await fetch("/api/validate/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: 1, code, output: capturedOutput }),
        });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data;
          if (data?.correct) {
            setOutput(`✅ Correct! The answer is ${correctAnswer}\n\n✨ Your code works perfectly!`);
            setTimeout(() => {
              onComplete();
            }, 1500);
            return; // stop on successful API validation
          } else {
            const actual = data?.actualOutput ?? "no output";
            setError(`❌ Wrong answer! You got ${actual}, expected ${correctAnswer}\n\nHint: 0+1+2+3+4+5+6+7+8+9+10 = ?`);
            return;
          }
        }
      } catch {
        // Silent fallback to local validation
      }
      
      
      const numbers = capturedOutput.trim().split('\n')
        .map(line => parseInt(line.trim()))
        .filter(num => !isNaN(num));
      
      // Local fallback: check if 55 exists in output (variable name agnostic)
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
          💡 Hints:<br />
          • Use a <code>for</code> loop from 0 to 10<br />
          • Add each number to your sum variable<br />
          • Don't forget to print the result with <code>console.log()</code>
        </p>

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