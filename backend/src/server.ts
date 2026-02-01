import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5004;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

connectDB().then(() => {
    const port = Number(PORT);
    httpServer.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
