const express = require('express');
const config = require('./config/config');
const app = config.setUpServer();
const con_string = process.env.DATABASE_URL;
const pg = require('pg');
const pg_client = new pg.Client(con_string);
console.log(con_string);

app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));

const port = process.env.PORT || 3000;

server = app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

const io = require('socket.io')(server);
pg_client.connect();
// const query = pg_client.query('LISTEN addedrecord');

io.on('connection', function(socket) {
  console.log(socket);
  console.log('ciaone');

  socket.on('ready for data', function(data) {
    console.log(data);
    pg_client.on('notification', function(title) {
      console.log(title);
      socket.emit('update', {message: title});
    });
  });
});

module.exports = app;

// let server;
// module.exports = {
//   start(port) {
//     server = app.listen(port, () => {
//       console.log(`App started on port ${port}`);
//     });

//     const io = require('socket.io')(server);
//     pg_client.connect();
//     // const query = pg_client.query('LISTEN addedrecord');

//     io.on('connection', function(socket) {
//       console.log(socket);
//       console.log('ciaone');

//       socket.on('ready for data', function(data) {
//         console.log(data);
//         pg_client.on('notification', function(title) {
//           console.log(title);
//           socket.emit('update', {message: title});
//         });
//       });
//     });

//     return app;
//   },
//   stop() {
//     server.close();
//   },
// };


