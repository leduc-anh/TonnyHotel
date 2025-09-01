import mongoose from "mongoose";

const bookingServiceSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    quantity: { type: Number, default: 1 }
});

export default mongoose.model("BookingService", bookingServiceSchema);
