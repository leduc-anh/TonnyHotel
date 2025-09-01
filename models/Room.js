import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        enum: ['single', 'double', 'suite'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'maintenance'],
        default: 'available'
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)
export default Room
