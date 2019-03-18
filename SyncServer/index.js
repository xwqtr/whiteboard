var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;
var sessions = [];

io.on('connection', function (socket) {

  socket.on('syncData', (data) => {
    check = sessions.findIndex(s => s.sid == socket.id && s.did == data.id) > -1;
    if (!check) {
      sessions.push({
        sid: socket.id,
        did: data.id
      });
    }

    sessions.forEach(s => {
      if (s.did == socket.id) {
        io.to(s.sid).emit('syncData', data.data);
      }
    });

    io.to(data.id).emit('syncData', data.data);
  });

  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});