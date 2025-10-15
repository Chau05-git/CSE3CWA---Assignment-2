"use client";
import React, { useState, useRef } from "react";
import "./Header_style.css";

interface Tab {
  id: number;
  title: string;
  content: string;
}

const Header: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const idRef = useRef(1);

  const addNewTab = () => {
    const id = idRef.current++;
    const newTab: Tab = { id, title: `Tab ${id}`, content: "" };
    setTabs((s) => [...s, newTab]);
    setActiveTab(id);
    setEditingContent("");
  };

  const selectTab = (tab: Tab) => {
    setActiveTab(tab.id);
    setEditingContent(tab.content);
  };

  const updateTabContent = (content: string) => {
    if (activeTab == null) return;
    setTabs((prev) => prev.map((t) => (t.id === activeTab ? { ...t, content } : t)));
    setEditingContent(content);
  };

  const deleteTab = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (activeTab === id) {
        if (next.length === 0) {
          setActiveTab(null);
          setEditingContent("");
        } else {
          const idx = prev.findIndex((t) => t.id === id);
          const pick = next[idx] ?? next[Math.max(0, idx - 1)];
          setActiveTab(pick.id);
          setEditingContent(pick.content);
        }
      }
      return next;
    });
  };

  return (
    <div className="header">
      <h2 className="header-title">Tabs Header</h2>

      <div className="tabs-header" role="tablist" aria-label="Editor tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => selectTab(tab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectTab(tab);
              }
            }}
            title={tab.title}
            tabIndex={0}
          >
            <span className="tab-label">{tab.title}</span>

            <button
              className="tab-close"
              onClick={(e) => deleteTab(tab.id, e)}
              aria-label={`Close ${tab.title}`}
              type="button"
            >
              ×
            </button>
          </div>
        ))}


        <button className="add-tab" onClick={addNewTab} aria-label="Add tab" type="button">
          <span>+</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab ? (
          <textarea
            className="content-editor"
            value={editingContent}
            onChange={(e) => updateTabContent(e.target.value)}
            placeholder="Type your content here..."
          />
        ) : (
          <div className="no-tab">No tab selected. Click + to add a tab.</div>
        )}
      </div>
    </div>
  );
};

export default Header;