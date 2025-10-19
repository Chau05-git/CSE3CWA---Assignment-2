"use client";
import { useState } from "react";
import "./Challenge.css";

type Props = {
  onComplete: () => void;
};

export default function DataPortChallenge({ onComplete }: Props) {
  const [code, setCode] = useState(`// Save user data to localStorage
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
console.log("Saved data:", saved);
`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const expectedData = {
    name: "John",
    age: 25,
    city: "NYC"
  };

  const handleRunCode = async () => {
    setError("");
    setOutput("");
    
    try {
      // Clear localStorage trước
      localStorage.removeItem("userData");
      
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
        const saved = localStorage.getItem("userData");
        const res = await fetch("/api/validate/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: 2, code, output: saved }),
        });
        if (res.ok) {
          const json = await res.json();
          const data = json?.data;
          if (data?.correct) {
            setOutput(`✅ Perfect! Data saved to localStorage successfully!\n\nSaved data:\n${JSON.stringify(data.actualData, null, 2)}\n\n✨ Your code works correctly!`);
            setTimeout(() => {
              localStorage.removeItem("userData"); // Cleanup
              onComplete();
            }, 1500);
            return; // stop on successful API validation
          } else {
            if (data?.actualData) {
              setOutput(`Saved data:\n${JSON.stringify(data.actualData, null, 2)}`);
            }
            setError(data?.message || "❌ Data saved but values are wrong!");
            return;
          }
        }
      } catch {
        // Silent fallback to local validation
      }

      // CHỈ KIỂM TRA localStorage, KHÔNG QUAN TÂM TÊN BIẾN
      const saved = localStorage.getItem("userData");
      
      if (!saved) {
        setError("❌ No data saved to localStorage!\n\nHint: Use localStorage.setItem('userData', ...)");
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        
        // Kiểm tra từng property, không quan tâm thứ tự
        const isCorrect = 
          parsed.name === expectedData.name &&
          parsed.age === expectedData.age &&
          parsed.city === expectedData.city;

        if (isCorrect) {
          setOutput("✅ Perfect! Data saved to localStorage successfully!\n\n" + 
                   "Saved data:\n" + JSON.stringify(parsed, null, 2) +
                   "\n\n✨ Your code works correctly!");
          setTimeout(() => {
            localStorage.removeItem("userData"); // Cleanup
            onComplete();
          }, 1500);
        } else {
          setOutput("Saved data:\n" + JSON.stringify(parsed, null, 2));
          setError("❌ Data saved but values are wrong!\n\nExpected:\n" + 
                  JSON.stringify(expectedData, null, 2));
        }
      } catch (e) {
        setError("❌ Data saved but not in JSON format!\n\nHint: Use JSON.stringify() before saving");
      }
      
    } catch (err: any) {
      setError(`❌ Code Error: ${err.message}\n\nCheck your syntax!`);
    }
  };

  return (
    <div className="challenge-overlay">
      <div className="challenge-container">
        <h2>💾 Challenge 2: Save Data to localStorage</h2>
        <p className="challenge-desc">
          Save the user object to <strong>localStorage</strong> with key <code>"userData"</code>
        </p>
        <p className="hint">
          💡 Hints:<br />
          • Use <code>JSON.stringify()</code> to convert object to string<br />
          • Use <code>localStorage.setItem(key, value)</code> to save data<br />
          • The key must be exactly <code>"userData"</code>
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
          <p>✅ Any variable names OK! Just make sure:</p>
          <ul style={{ textAlign: "left", margin: "8px 0", paddingLeft: 20, color: "#94a3b8", fontSize: 14 }}>
            <li>Key must be <code>"userData"</code></li>
            <li>Data must be JSON string</li>
            <li>Contains: name="John", age=25, city="NYC"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}