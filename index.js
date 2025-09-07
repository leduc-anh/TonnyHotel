import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config()
const app = express()
app.use(cors({
    origin: `http://localhost:5173`,
    credentials: true
}));
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/user', userRoutes);
app.get('/', (req, res) => {
    res.send('Hello World!')
})
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    }).catch((err) => console.error(err))