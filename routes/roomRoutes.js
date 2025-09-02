import express from "express";
import Room from "../models/Room.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try { const room = await Room.create(req.body); res.status(201).json(room); }
    catch (err) { res.status(500).json(err); }
});

router.get("/", async (req, res) => {
    try { const rooms = await Room.find(); res.json(rooms); }
    catch (err) { res.status(500).json(err); }
});

router.get("/:id", async (req, res) => {
    try { const room = await Room.findById(req.params.id); res.json(room); }
    catch (err) { res.status(500).json(err); }
});


router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try { const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(room); }
    catch (err) { res.status(500).json(err); }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try { await Room.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }
    catch (err) { res.status(500).json(err); }
});
router.post("/:roomId/review", verifyToken, async (req, res) => {
    try {
        const { rating, comment } = req.body
        const room = await Room.findById(req.params.roomId)
        if (!room) return res.status(404).json({ message: "Room not found" })

        room.reviews.push({
            userId: req.user._id,
            rating,
            comment
        })
        const total = room.reviews.reduce((sum, r) => sum + r.rating, 0)
        room.averageRating = total / room.reviews.length

        await room.save()
        res.status(200).json(room)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})
export default router;

