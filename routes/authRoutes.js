import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import express from "express";

const router = express.Router();

// Regex check password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/;

router.post('/register', async (req, res) => {
    const { username, email, password, phone, address, role } = req.body;

    try {
        // Check email exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // if admin and pass = 123 not validate
        if (!(username === "admin" && password === "12345679")) {
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message:
                        "Mật khẩu phải ≥12 ký tự, có chữ thường, chữ hoa và ký tự đặc biệt!",
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            role: role || "user"
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Wrong password or email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password or email" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ token, user });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json(err);
    }
});

export default router;
