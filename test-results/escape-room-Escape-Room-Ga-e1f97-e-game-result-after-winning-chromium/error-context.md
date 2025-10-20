# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - paragraph [ref=e4]: 🔒 Escape Room Challenge!
    - generic [ref=e6]:
      - heading "🎉 Escaped!" [level=1] [ref=e7]
      - paragraph [ref=e8]: You successfully escaped the room!
      - paragraph [ref=e9]: "⏱️ Time: 0m 6s"
      - generic [ref=e10]:
        - textbox "Enter your name (optional)" [ref=e11]: E2E Test Player
        - button "💾 Save Result" [ref=e12] [cursor=pointer]
        - paragraph [ref=e13]: "✓ Result saved! ID: 9"
      - link "🏠 Back to Home" [ref=e15] [cursor=pointer]:
        - /url: /
  - alert [ref=e16]
```