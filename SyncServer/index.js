var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3001;


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
io.on('connection', function(socket){
  
  socket.on('syncData', (data) => {
    io.to(socket.id).emit('syncData', data);
    console.log('message: ' + data);
  });
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});
