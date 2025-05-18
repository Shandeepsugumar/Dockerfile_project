const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for a message from the client
  socket.on('chatMessage', (msg) => {
    // Broadcast message to everyone connected
    io.emit('chatMessage', msg);
  });

  // Handle user disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Run the server on port 5000
const PORT =  process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
