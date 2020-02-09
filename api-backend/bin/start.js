const Server = require('../server');

Server.start(process.env.PORT);

const io = require('socket.io')(Server);

const con_string = process.env.DATABASE_URL;
const pg = require('pg');
const pg_client = new pg.Client(con_string);
pg_client.connect();
const query = pg_client.query('LISTEN addedrecord');

io.sockets.on('connection', function (socket) {
    console.log(socket);
    console.log('ciaone');
    socket.emit('connected', { connected: true });

    socket.on('ready for data', function (data) {
        console.log(data);
        pg_client.on('notification', function(title) {
            console.log(title);
            socket.emit('update', { message: title });
        });
    });
});
