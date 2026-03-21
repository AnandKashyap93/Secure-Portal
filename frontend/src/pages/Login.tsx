import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import Captcha from '../components/Captcha';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            await login(email, password);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-background text-foreground items-center justify-center">
            {/* Cinematic Animated CSS Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 animate-gradient-xy opacity-80">
                {/* Minimalist animated particles/overlay effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] opacity-90" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-75" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 py-12 lg:py-0">
                {/* Left Side: Branding */}
                <div className="flex-1 w-full text-center lg:text-left">
                    <Link to="/" className="inline-flex items-center gap-4 group mb-12 lg:mb-24">
                        <Lock className="w-5 h-5 text-foreground/50 group-hover:text-foreground transition-colors" strokeWidth={1} />
                        <span className="font-light text-xs tracking-[0.2em] uppercase text-foreground/50 group-hover:text-foreground transition-colors">Back to Home</span>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl lg:text-8xl font-light tracking-tighter mb-8 leading-[1.1]">Welcome <br className="hidden lg:block" />Back.</h1>
                        <p className="text-lg font-light text-foreground/50 leading-relaxed max-w-md mx-auto lg:mx-0">
                            Sign in to securely upload, review, and manage your documents.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Form Container */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md bg-foreground/[0.03] backdrop-blur-3xl border border-foreground/10 p-10 lg:p-12 relative shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                    <div className="mb-12">
                        <h2 className="text-3xl font-light tracking-tight mb-2">Sign In</h2>
                        <p className="text-sm font-light text-foreground/50">Authenticate to continue.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 mb-8 border border-red-500/30 bg-red-500/10 text-red-400 text-xs tracking-widest uppercase font-light text-center">
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within:text-foreground/80 transition-colors">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-foreground/20 focus:border-foreground py-3 outline-none transition-all placeholder:text-foreground/10 font-light text-lg"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em] group-focus-within:text-foreground/80 transition-colors">Password</label>
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
                            className="w-full py-5 mt-8 bg-foreground text-background text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group/btn hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                            {!loading && <ArrowRight strokeWidth={1} className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-16 pt-8 border-t border-foreground/10 text-xs font-light text-foreground/40 flex flex-col gap-6">
                        <div className="tracking-widest uppercase text-center">
                            Don't have an account? <Link to="/register" className="text-foreground hover:text-foreground/80 border-b border-foreground/30 pb-1 ml-2 transition-colors">Sign Up</Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
