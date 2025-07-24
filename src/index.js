import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { httpServer, app } from './lib/socket.js';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(cookieParser());
//cors config to connect frontend with backend
app.use(cors({
    origin: "https://chat-app-frontend-neon-xi.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']

}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes)

httpServer.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
    connectDB()
});