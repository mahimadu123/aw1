const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = 3000;
const FILE_PATH = 'messages.txt';

const server = http.createServer((req, res) => {
  // Handle GET request: Display form and messages from file
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
      let messagesList = [];
      if (!err && data) {
        // Split by newline and filter out empty lines
        messagesList = data.trim().split('\n').filter(Boolean);
      }

      // Format messages so the newest ones appear at the top
      const messagesHtml = messagesList.length > 0 
        ? messagesList.reverse().map(msg => `<li>${msg}</li>`).join('') 
        : '<p>No messages yet.</p>';

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Message Board</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                ul { padding-left: 20px; }
                li { background: #f4f4f4; margin: 5px 0; padding: 8px; border-radius: 4px; }
            </style>
        </head>
        <body>
            <h1>Leave a Message</h1>
            
            <!-- Form -->
            <form action="/submit" method="POST">
                <input type="text" name="message" placeholder="Type your message here..." required />
                <button type="submit">Submit</button>
            </form>

            <h2>Recent Messages (Newest First)</h2>
            <ul>
                ${messagesHtml}
            </ul>
        </body>
        </html>
      `);
    });
  } 
  // Handle POST request: Append data and send 302 Redirect
  else if (req.method === 'POST' && req.url === '/submit') {
    let body = '';

    // Collect data chunks streams
    req.on('data', chunk => {
      body += chunk;
    });

    // When all data has been received
    req.on('end', () => {
      const parsedData = querystring.parse(body);
      const newMessage = parsedData.message;

      if (newMessage) {
        // Append message to file with a newline
        fs.appendFile(FILE_PATH, newMessage + '\n', (err) => {
          if (err) {
            console.error('Error writing to file', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('500 Internal Server Error');
          }

          // Send 302 Redirect back to the home page
          res.writeHead(302, { 'Location': '/' });
          res.end();
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Message cannot be empty');
      }
    });
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});