const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(__dirname));

// Track connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Broadcast new player count to all clients
    broadcastPlayerCount();

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        broadcastPlayerCount();
    });

    // Handle ping messages to keep connection alive
    ws.on('ping', () => {
        ws.pong();
    });
});

function broadcastPlayerCount() {
    const count = clients.size;
    const message = JSON.stringify({ type: 'playerCount', count });
    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
