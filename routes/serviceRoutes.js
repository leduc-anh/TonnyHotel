import express from "express";
import Service from "../models/Service.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try { const service = await Service.create(req.body); res.status(201).json(service); }
    catch (err) { res.status(500).json(err); }
});

router.get("/", async (req, res) => {
    try { const services = await Service.find(); res.json(services); }
    catch (err) { res.status(500).json(err); }
});


router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try { const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(service); }
    catch (err) { res.status(500).json(err); }
});


router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try { await Service.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); }
    catch (err) { res.status(500).json(err); }
});

export default router;
