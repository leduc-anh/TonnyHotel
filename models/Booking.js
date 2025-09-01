import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
