var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;


function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

io.on('connection', function (socket) {
  if (typeof socket._rooms === 'undefined' || socket._rooms.length <= 0) {
    var guid = uuidv4();
    socket.join(guid);
    io.to(guid).emit('connected', guid);
  }

  socket.on('syncData', (data) => {
    socket.join(data.id);
    socket.in(data.id).emit('syncData', data.data);
  });

  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});