import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
});

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approverEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isUrgent: { type: Boolean, default: false },
    comments: [commentSchema]
}, { timestamps: true });

export const Document = mongoose.model('Document', documentSchema);
