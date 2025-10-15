"use client";
import React from 'react';
import './CodeDisplay_style.css';

type Props = {
  code?: string;
};

const CodeDisplay: React.FC<Props> = ({ code = '' }) => {
  const handleCopy = () => {
    if (code) navigator.clipboard.writeText(code);
  };

  return (
    <div className="code-container">
      <div className="code-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Source Code Output</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            className="copy-button"
            href="?gen=1"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Generate all code in .tsx file and display in this frame"
          >
            Generate
          </a>
          <a
            className="copy-button"
            href="/"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            title="Delete result (return to homepage)"
          >
            Clear
          </a>
          <button className="copy-button" onClick={handleCopy} disabled={!code}>
            Copy Code
          </button>
        </div>
      </div>

      <div className="code-content">
        <pre>
          <code>
            {code || `/* press "Generate" to collect and display all .tsx source code files here */`}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;