import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain text for MVP fast demo only
    role: { type: String, enum: ['admin', 'user', 'approver'], default: 'user' },
    pfpUrl: { type: String, default: '' },
    deleteOtp: { type: String },
    deleteOtpExpires: { type: Date }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
