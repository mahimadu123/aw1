const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 3000;
const FILE_PATH = 'message.txt';

const server = http.createServer((req, res) => {
  // GET Request: పేజీని లోడ్ చేయడం మరియు ఫైల్ లో ఉన్న డేటాను పైన చూపించడం
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      let fileContent = '';
      if (!err && data) {
        fileContent = data.trim();
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Message App</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .message-box { font-size: 18px; margin-bottom: 20px; font-weight: bold; }
                form { margin-top: 10px; }
                input[type="text"] { width: 300px; padding: 6px; }
                button { padding: 6px 12px; }
            </style>
        </head>
        <body>
            <!-- ఫైల్ లో ఉన్న మెసేజ్ ఇక్కడ పైన డిస్ప్లే అవుతుంది -->
            <div class="message-box">${fileContent}</div>

            <!-- ఇన్పుట్ ఫామ్ -->
            <form action="/submit" method="POST">
                <input type="text" name="message" autocomplete="off" required />
                <button type="submit">Send</button>
            </form>
        </body>
        </html>
      `);
    });
  } 
  // POST Request: డేటాను తీసుకొని స్పేస్‌లను '+' తో మార్చి ఫైల్‌లో సేవ్ చేయడం మరియు 302 రీడైరెక్ట్ చేయడం
  else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const parsedData = querystring.parse(body);
      let userMessage = parsedData.message;

      if (userMessage) {
        // స్పేస్‌లను ప్లస్ (+) సింబల్‌తో రీప్లేస్ చేయడం (ఉదాహరణకు: hi yash -> hi+yash)
        userMessage = userMessage.trim().replace(/\s+/g, '+');

        // ఫైల్‌లో ఓవర్‌రైట్ లేదా అపెండ్ చేయడం (ఇక్కడ లేటెస్ట్ మెసేజ్ మాత్రమే ఉండాలంటే writeFile వాడవచ్చు)
        fs.writeFile(FILE_PATH, userMessage, (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Server Error');
          }

          // 302 Redirect to home page
          res.writeHead(302, { 'Location': '/' });
          res.end();
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});