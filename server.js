const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
let users = [];

app.use(express.static('client'));

app.use('/*/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('login', (payload) => {
    users.push({
      id: socket.id,
      name: payload.name,
    });
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${payload.name} has joined the conversation!`,
    });
  });
  socket.on('disconnect', () => {
    const user = users.find(user => user.id == socket.id);
    if(user) {
        users = users.filter((user) => user.id != socket.id);
        socket.broadcast.emit('message', {
          author: 'Chat Bot',
          content: `${user.name} has left the conversation...`,
        });
    }
    console.log('Oh, socket ' + socket.id + ' has left');
  });
});
