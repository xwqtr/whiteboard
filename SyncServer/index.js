const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;
const passport = require('passport');

const imagesCache = {};

  app.use(express.static('public'));
  app.use((req,res,next)=>{
    express.cookieParser();
    next();
  });
  
  app.use((req,res,next)=>{
    express.bodyParser();
    next();
  });
  app.use((req,res,next)=>{
    express.session({ secret: 'keyboard cat' })
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
function updateCache(dataObject) {
  imagesCache[dataObject.id] = dataObject.data;
}

function getCacheObject(roomId) {
  console.log(imagesCache);
  return imagesCache[roomId];
}

function cleanCache(roomId) {
  delete imagesCache[roomId];
}

function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

io.on('connection', function (socket) {
  let roomName = socket.handshake.query.roomName;
  if (roomName == null) {
    roomName = uuidv4();
    socket.join(roomName);
    io.to(roomName).emit('connected', roomName);
  }
  console.log(roomName);
  socket.on('syncData', (data) => {
    socket.join(roomName);
    updateCache(data);
    socket.in(roomName).emit('syncData', data.data);
  });
  socket.on('getCache', (data) => {
    if (roomName != null) {
      const cache = getCacheObject(roomName);
      if (cache) {
        io.to(socket.id).emit('syncData', cache)
      }
    }
  })
  console.log('a user connected');

  socket.on('disconnect', function (s) {
    io.in(roomName).clients((error, clients) => {
      if (error) throw error;
      console.log(clients);
      if (clients.length <= 0) {
        cleanCache(roomName);
      }
    });
    console.log('user disconnected');
  });
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});
