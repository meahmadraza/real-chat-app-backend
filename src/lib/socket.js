import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ["https://chat-app-frontend-neon-xi.vercel.app"]
    }
});

io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
})

export { io, httpServer, app }