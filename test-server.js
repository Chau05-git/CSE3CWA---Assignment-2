const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  
  if (req.url === '/EscapeRoom') {
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Escape Room Challenge</title>
</head>
<body>
    <h1>Escape Room Challenge</h1>
    <p>Time Remaining: <span id="timer">10:00</span></p>
    <button id="start-btn">Start</button>
    <div id="game-content" style="display:none;">
        <h2>Challenge 1: Calculate Sum</h2>
        <textarea class="code-editor" placeholder="Enter your code here..."></textarea>
        <button>Run Code</button>
        <div id="result"></div>
    </div>

    <script>
        const startBtn = document.getElementById('start-btn');
        const gameContent = document.getElementById('game-content');
        
        startBtn.addEventListener('click', () => {
            startBtn.textContent = 'Pause';
            gameContent.style.display = 'block';
        });
    </script>
</body>
</html>
    `);
  } else {
    res.end('<h1>Test Server</h1><p>Go to <a href="/EscapeRoom">/EscapeRoom</a></p>');
  }
});

server.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}/`);
});