"use client";
import React, { useState } from 'react';
import './CodeDisplay_style.css';

type Props = {
  code?: string;
};

const CodeDisplay: React.FC<Props> = ({ code = '' }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleCopy = () => {
    if (code) navigator.clipboard.writeText(code);
  };

  const handleSave = async () => {
    if (!code) {
      setSaveMessage('No code to save!');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/code-outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Code Output - ${new Date().toLocaleString()}`,
          content: code,
          language: 'typescript',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSaveMessage(`✓ Saved successfully! ID: ${data.id}`);
      } else {
        setSaveMessage('✗ Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('✗ Error saving to database');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  return (
    <div className="code-container">
      <div className="code-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ margin: 0 }}>Source Code Output</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
          <button 
            className="copy-button" 
            onClick={handleSave} 
            disabled={!code || isSaving}
            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
            title="Save code output to database"
          >
            {isSaving ? 'Saving...' : '💾 Save to DB'}
          </button>
          {saveMessage && (
            <span style={{ 
              fontSize: '0.9em', 
              color: saveMessage.includes('✓') ? '#28a745' : '#dc3545',
              fontWeight: 'bold'
            }}>
              {saveMessage}
            </span>
          )}
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