const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.send('Location Tracking Server');
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('sendLocation', (location) => {
    console.log('Location received:', location);
    // Broadcast location to all clients
    io.emit('receiveLocation', location);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
