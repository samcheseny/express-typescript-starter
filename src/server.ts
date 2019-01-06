import app from './App';
import * as dotenv from 'dotenv';
import {Server} from 'http';
import * as Debug from 'debug';
import * as socket from 'socket.io';
import {AddressInfo} from "net";

dotenv.config();

const server = new Server(app);
const debug = Debug('generated:server');
const io = socket(server);
const port = parseInt(process.env.PORT, 10) || 8000;

app.set('port', port);

server.listen(port);

// io.on('connection', (socket) => {
//
//     socket.emit('news', {hello: 'world'});
//
//     socket.on('my other event', (data) => console.log(data));
//
// });

server.on('error', (error: any) => {

    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {

        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;

    }

});

server.on('listening', () => {

    let address: string | AddressInfo = server.address();

    let bind: any = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;

    debug('Listening on ' + bind);

});