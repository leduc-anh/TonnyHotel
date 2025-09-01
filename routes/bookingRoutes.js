import express from "express";
import Booking from "../models/Booking.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import Room from "../models/Room.js";
import Service from "../models/Service.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
    try {
        const { roomId, checkIn, checkOut, services } = req.body;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

        let total = room.price * nights;
        if (services && services.length > 0) {
            for (let s of services) {
                const service = await Service.findById(s.serviceId);
                if (service) total += service.price * s.quantity;
            }
        }
        const booking = await Booking.create({
            userId: req.user._id,
            roomId,
            checkIn,
            checkOut,
            totalPrice: total,
            status: "pending"
        });
        res.status(201).json(booking);
    } catch (err) {
        return res.status(500).json(err);
    }

});

router.get("/", verifyToken, isAdmin, async (req, res) => {
    try { const bookings = await Booking.find().populate("userId roomId"); res.json(bookings); }
    catch (err) { res.status(500).json(err); }
});


router.get("/my", verifyToken, async (req, res) => {
    try { const bookings = await Booking.find({ userId: req.user._id }).populate("roomId"); res.json(bookings); }
    catch (err) { res.status(500).json(err); }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try { const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(booking); }
    catch (err) { res.status(500).json(err); }
});


router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try { await Booking.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }
    catch (err) { res.status(500).json(err); }
});

export default router;
