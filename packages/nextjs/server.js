const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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
    let currentRoomNumber = 1;
    const rooms = {};
    const playerAccounts = {}; // Map to store player account addresses

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Find a room with less than 2 players or create a new room
        let roomId;
        for (const id of Object.keys(rooms)) {
            if (rooms[id].size < 2) {
                roomId = id;
                break;
            }
        }
        if (!roomId) {
            roomId = `room-${currentRoomNumber}`;
            rooms[roomId] = new Set();
            currentRoomNumber++;
        }

        // Join the room
        socket.join(roomId);
        rooms[roomId].add(socket.id);
        console.log(`User ${socket.id} joined room ${roomId}`);
        io.to(roomId).emit('players', rooms[roomId].size);

        // Store player account address
        socket.on('registerAccount', (account) => {
            playerAccounts[socket.id] = account;
            console.log(`User ${socket.id} registered account ${account}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            rooms[roomId].delete(socket.id);
            delete playerAccounts[socket.id];
            if (rooms[roomId].size === 0) {
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('players', rooms[roomId].size);
            }
        });

        if (rooms[roomId].size === 2) {
            console.log(`Starting game in room ${roomId}`);
            io.to(roomId).emit('startGame');
        }

        socket.on('updateBird', (bird) => {
            socket.to(roomId).emit('updateBird', bird);
        });

        socket.on('playerLost', () => {
            if (rooms[roomId].size === 2) {
                // Find the other player
                rooms[roomId].forEach((clientId) => {
                    if (clientId !== socket.id) {
                        io.to(clientId).emit('gameResult', { result: 'win', opponent: playerAccounts[socket.id] });
                    }
                });
                socket.emit('gameResult', { result: 'lose', opponent: playerAccounts[Array.from(rooms[roomId]).find(id => id !== socket.id)] });
            }
        });
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