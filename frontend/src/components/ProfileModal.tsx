import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Captcha from './Captcha';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, updateProfile, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [pfp, setPfp] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Account deletion state
    const [deleteMode, setDeleteMode] = useState(false);
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    if (!isOpen || !user) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCaptchaValid) return alert('Please complete the security verification');
        setLoading(true);
        try {
            const formData = new FormData();
            if (name !== user.name) formData.append('name', name);
            if (email !== user.email) formData.append('email', email);
            if (password) formData.append('password', password);
            if (pfp) formData.append('pfp', pfp);

            const { data } = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateProfile(data.token, data.user);
            alert('Settings Configured');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to configure profile');
        } finally {
            setLoading(false);
        }
    };

    // Removed OTP request handler

    const handleDeleteAccount = async () => {
        if (!isCaptchaValid) return alert('Please complete the security verification');
        setLoading(true);
        try {
            await api.delete('/users/profile');
            alert('Node Terminated. Goodbye.');
            onClose();
            logout();
        } catch (error) {
            alert('Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-12"
            >
                {/* Cinematic Modal */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                    className="bg-background border border-foreground/20 w-full max-w-2xl relative overflow-hidden"
                >
                    <div className="flex justify-between items-center p-8 border-b border-foreground/10 relative">
                        <div>
                            <h2 className="text-2xl font-light tracking-tighter text-foreground">Profile Settings</h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50 mt-1">Update your account details</p>
                        </div>
                        <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition p-2 border border-transparent hover:border-foreground/20">
                            <X size={20} strokeWidth={1} />
                        </button>
                    </div>

                    <div className="p-8 lg:p-10">
                        {!deleteMode ? (
                            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                {/* Left Col - Avatar */}
                                <div className="md:col-span-4 flex flex-col items-start">
                                    <div className="relative group cursor-pointer w-full aspect-square border-2 border-dashed border-foreground/20 hover:border-foreground transition-all flex items-center justify-center overflow-hidden rounded-full shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                        {pfp ? (
                                            <img src={URL.createObjectURL(pfp)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : user.pfpUrl ? (
                                            <img src={`http://localhost:5000${user.pfpUrl}`} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl font-light text-foreground/30">{user.name.charAt(0)}</span>
                                        )}
                                        <label className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer">
                                            <div className="text-center">
                                                <Upload size={20} strokeWidth={1} className="text-foreground mx-auto mb-2" />
                                                <span className="text-[9px] uppercase tracking-[0.2em] text-foreground">Upload Photo</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && setPfp(e.target.files[0])} />
                                        </label>
                                    </div>
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 mt-4 leading-relaxed">Profile Picture</p>
                                </div>

                                {/* Right Col - Details */}
                                <div className="md:col-span-8 space-y-6">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">Full Name</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 p-3 text-foreground font-light outline-none focus:border-foreground transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">Email Address</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b border-foreground/20 p-3 text-foreground font-light outline-none focus:border-foreground transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2">New Password</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="LEAVE BLANK FOR CURRENT" className={`w-full bg-transparent border-b border-foreground/20 p-3 pr-10 text-foreground font-light outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 ${!showPassword && password ? 'tracking-widest' : ''}`} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground bg-background/80 backdrop-blur-sm rounded p-1.5 transition-colors z-10"
                                                title={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <EyeOff size={18} strokeWidth={1} /> : <Eye size={18} strokeWidth={1} />}
                                            </button>
                                        </div>
                                    </div>

                                    <Captcha onVerify={setIsCaptchaValid} />

                                    <div className="pt-8 border-t border-foreground/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                        <button type="button" onClick={() => setDeleteMode(true)} className="text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition hover:border-b hover:border-foreground pb-1">
                                            Delete Account
                                        </button>
                                        <button type="submit" disabled={loading || !isCaptchaValid} className="w-full sm:w-auto px-8 py-3 bg-foreground text-background text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-background hover:text-foreground border border-transparent hover:border-foreground transition-all disabled:opacity-50">
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="max-w-sm mx-auto space-y-8 py-4">
                                <div className="text-center">
                                    <AlertTriangle className="mx-auto text-foreground mb-6" strokeWidth={1} size={40} />
                                    <h3 className="text-2xl font-light tracking-tighter text-foreground mb-2">Delete Account</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 leading-relaxed">Are you sure you want to delete your account?</p>
                                </div>

                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <Captcha onVerify={setIsCaptchaValid} />
                                    
                                    <div className="grid grid-cols-2 gap-4 mt-8">
                                        <button onClick={() => setDeleteMode(false)} className="py-3 border border-foreground/20 text-foreground hover:border-foreground text-[10px] uppercase tracking-[0.2em] font-medium transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={handleDeleteAccount} disabled={loading || !isCaptchaValid} className="py-3 bg-foreground text-background hover:bg-background hover:text-foreground border border-transparent hover:border-foreground text-[10px] uppercase tracking-[0.2em] font-medium transition-all disabled:opacity-50">
                                            {loading ? 'Deleting...' : 'Delete Account'}
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
