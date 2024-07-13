const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let playersCount = 0;

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = socketIo(server);

    io.on('connection', (socket) => {
        playersCount++;
        console.log('A user connected:', socket.id);
        io.emit('players', playersCount); // Broadcast the number of players

        socket.on('disconnect', () => {
            playersCount--;
            console.log('User disconnected:', socket.id);
            io.emit('players', playersCount); // Broadcast the number of players
        });

        // Handle other socket events here
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });

    server.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });
});
