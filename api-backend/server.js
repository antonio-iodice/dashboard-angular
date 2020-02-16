const config = require('./config/config');
const app = config.setUpServer();
const CON_STRING = process.env.DATABASE_URL;
const pg = require('pg');
const pgClient = new pg.Client(CON_STRING);

app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));

const port = process.env.PORT || 3000;

server = app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

const io = require('socket.io')(server);
pgClient.connect();
pgClient.query('LISTEN addedrecord');

io.on('connection', function(socket) {
  console.log(socket);

  socket.on('ready for data', function(data) {
    console.log(data);
    pgClient.on('notification', function(title) {
      console.log(title);
      socket.emit('update', {message: title});
    });
  });
});

module.exports = app;


