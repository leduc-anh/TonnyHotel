import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";


const router = express.Router();


router.get("/my", verifyToken, async (req, res) => {
    try { const user = await User.findById(req.user._id); res.json(user); }
    catch (err) { res.status(500).json(err); }
});

router.put("/:id", verifyToken, async (req, res) => {
    try { const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(user); }
    catch (err) { res.status(500).json(err); }
});


export default router;
