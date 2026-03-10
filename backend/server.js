import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from './models/User.js';
import { Document } from './models/Document.js';

const app = express();
app.use(cors());
app.use(express.json());

let emailTransporter;
nodemailer.createTestAccount().then(account => {
    emailTransporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    console.log('Ethereal Email initialized for mocked sending.');
}).catch(console.error);

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-super-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-portal-mvp';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer Setup for File Uploads (Public Directory)
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// ====== AUTHENTICATION MIDDLEARWE ======
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
};

const userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user' && req.user.role !== 'admin') return res.status(403).json({ error: 'User access required' });
    next();
};

// ====== SEED DATA (Demo Ready) ======
async function seedData() {
    // Remove the demo admin if it exists
    await User.deleteOne({ email: 'admin@demo.com' });

    const userExists = await User.findOne({ email: 'user@demo.com' });
    if (!userExists) {
        await User.create({ name: 'Test User', email: 'user@demo.com', role: 'user', password: 'password123' });
        await User.create({ name: 'Test Approver', email: 'approver@demo.com', role: 'approver', password: 'password123' });
        console.log('Seed users created (user / approver) @demo.com with password: password123');
    }

    const customAdminExists = await User.findOne({ email: 'anandkumarkashyap9956@gmail.com' });
    if (!customAdminExists) {
        await User.create({ name: 'Anand Kumar Kashyap', email: 'anandkumarkashyap9956@gmail.com', role: 'admin', password: 'Pasword@1234' });
        console.log('Custom admin user created');
    } else {
        customAdminExists.password = 'Pasword@1234';
        await customAdminExists.save();
        console.log('Custom admin password updated');
    }
}
seedData();

// ====== ROUTES ======

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl } });
});

// Register Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const userRole = role === 'approver' ? 'approver' : 'user'; // Default to user unless approver requested. Cannot register as admin.
        const user = await User.create({ name, email, password, role: userRole });

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl } });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// ====== PROFILE ROUTES ======

app.put('/api/users/profile', authMiddleware, upload.single('pfp'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (req.file) {
            user.pfpUrl = `/uploads/${req.file.filename}`;
        }

        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, role: user.role, name: user.name, email: user.email, pfpUrl: user.pfpUrl } });
    } catch (error) {
        res.status(500).json({ error: 'Profile update failed' });
    }
});

// Removed OTP generation route as we migrated to frontend Captcha verification

app.delete('/api/users/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await User.findByIdAndDelete(req.user.id);
        res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});


// ====== ADMIN ROUTES ======

app.get('/api/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot delete yourself' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.user.id === req.params.id) return res.status(400).json({ error: 'Cannot change your own role' });
        const { role } = req.body;
        if (!['user', 'approver', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.role = role;
        await user.save();
        res.json({ success: true, message: 'Role updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalApprovers = await User.countDocuments({ role: 'approver' });
        const totalDocs = await Document.countDocuments();
        const pendingDocs = await Document.countDocuments({ status: 'pending' });
        res.json({ totalUsers, totalApprovers, totalDocs, pendingDocs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ====== DOCUMENT ROUTES ======

app.post('/api/documents', authMiddleware, userMiddleware, upload.single('document'), async (req, res) => {
    try {
        const { title, approverEmail, isUrgent } = req.body;
        const document = new Document({
            title,
            fileUrl: `/uploads/${req.file.filename}`,
            uploaderId: req.user.id,
            approverEmail,
            isUrgent: isUrgent === 'true' || isUrgent === true
        });
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/documents', authMiddleware, async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'user') {
            filter = { uploaderId: req.user.id };
        } else if (req.user.role === 'approver') {
            filter = { approverEmail: req.user.email };
        }
        const documents = await Document.find(filter)
            .populate('uploaderId', 'name email')
            .sort({ isUrgent: -1, createdAt: -1 }); // Urgent docs first
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/documents/:id', authMiddleware, async (req, res) => {
    try {
        const { status, comment } = req.body;
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ error: 'Document not found' });

        // Only assigned approver can approve/reject
        if (req.user.role === 'approver' && document.approverEmail !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized for this document' });
        }

        if (status) document.status = status;
        if (comment) {
            document.comments.push({ text: comment, author: req.user.name });
        }

        await document.save();
        const populatedDocs = await Document.findById(document._id).populate('uploaderId', 'name email');
        res.json(populatedDocs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ error: 'Document not found' });

        // Only uploader can delete their own documents, and only if pending
        if (document.uploaderId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this document' });
        }
        
        if (document.status !== 'pending') {
            return res.status(400).json({ error: 'Can only delete pending documents' });
        }

        await Document.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
