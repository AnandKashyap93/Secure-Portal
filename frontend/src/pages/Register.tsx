import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Captcha from '../components/Captcha';

export default function Register() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'approver'>('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCaptchaValid) return setError('Please complete the security verification');
        setLoading(true);
        setError('');
        try {
            await register(name, email, password, role);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-background text-foreground items-center justify-center py-12">
            {/* Cinematic Animated CSS Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-black via-neutral-950 to-black animate-gradient-xy opacity-90">
                {/* Minimalist animated particles/overlay effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] opacity-90" />
                <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neutral-900/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center min-h-[80vh]">
                <div className="w-full flex justify-start mb-10 lg:mb-16">
                    <Link to="/" className="flex items-center gap-4 group">
                        <Lock className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors" strokeWidth={1} />
                        <span className="font-light text-xs tracking-[0.2em] uppercase text-foreground/50 group-hover:text-foreground transition-colors">Back to Home</span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl mx-auto bg-foreground/[0.03] backdrop-blur-3xl border border-foreground/10 p-10 lg:p-16 relative shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                    <div className="mb-12 text-center">
                        <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-4">Create Account.</h1>
                        <p className="text-sm font-light text-foreground/50 tracking-wide">Sign up to start using the platform.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 mb-8 border border-red-500/30 bg-red-500/10 text-red-400 text-xs tracking-widest uppercase font-light text-center">
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative group/input">
                                <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within/input:text-foreground/80 transition-colors">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground py-3 outline-none transition-all placeholder:text-foreground/10 font-light text-lg"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="relative group/input">
                                <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within/input:text-foreground/80 transition-colors">Role</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value as 'user' | 'approver')}
                                    className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground py-3.5 outline-none transition-all text-foreground/80 font-light text-base appearance-none cursor-pointer"
                                >
                                    <option value="user" className="bg-background text-foreground">User</option>
                                    <option value="approver" className="bg-background text-foreground">Approver</option>
                                </select>
                            </div>
                        </div>

                        <div className="relative group/input">
                            <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within/input:text-foreground/80 transition-colors">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground py-3 outline-none transition-all placeholder:text-foreground/10 font-light text-lg"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="relative group/input">
                            <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within/input:text-foreground/80 transition-colors">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`w-full bg-transparent border-b border-foreground/20 focus:border-foreground py-3 pr-10 outline-none transition-all placeholder:text-foreground/10 font-light text-lg ${!showPassword && password ? 'tracking-widest' : ''}`}
                                    placeholder="••••••••"
                                    required
                                />
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

                        <button
                            disabled={loading || !isCaptchaValid}
                            className="w-full py-5 mt-12 border border-foreground bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-background hover:text-foreground transition-all duration-500 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="text-center mt-12 pt-8 border-t border-foreground/10 text-[10px] font-light text-foreground/40 uppercase tracking-widest flex items-center justify-center gap-2">
                            Already have an account? <Link to="/login" className="text-foreground hover:text-foreground/80 border-b border-foreground/30 pb-1 transition-colors">Sign In</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
