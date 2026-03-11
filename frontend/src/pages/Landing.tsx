import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight, Menu, X } from 'lucide-react';

const Nav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-background/80 backdrop-blur-2xl py-4' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-8 h-8 flex items-center justify-center text-foreground">
                        <Lock className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                    </div>
                    <span className="font-light text-sm tracking-[0.2em] uppercase text-foreground">SecurePortal</span>
                </Link>

                <div className="hidden md:flex space-x-12">
                    {['Platform', 'Technology', 'Company'].map(i => (
                        <a key={i} href={`#${i.toLowerCase()}`} className="text-xs font-light tracking-widest uppercase text-foreground/60 hover:text-foreground transition-colors duration-300">
                            {i}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/login" className="text-xs font-light tracking-widest uppercase text-foreground/60 hover:text-foreground transition-colors duration-300">Sign In</Link>
                    <Link to="/register" className="px-8 py-3 bg-foreground text-background text-xs font-medium tracking-widest uppercase hover:bg-foreground/90 hover:scale-[1.02] transition-all duration-500">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X strokeWidth={1} /> : <Menu strokeWidth={1} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-background border-t border-foreground/10 md:hidden flex flex-col p-6 gap-6"
                    >
                        {['Platform', 'Technology', 'Company'].map(i => (
                            <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-light tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors">
                                {i}
                            </a>
                        ))}
                        <hr className="border-foreground/10" />
                        <Link to="/login" className="text-sm font-light tracking-widest uppercase text-foreground/70 hover:text-foreground transition-colors">Sign In</Link>
                        <Link to="/register" className="text-center py-4 bg-foreground text-background text-sm font-medium tracking-widest uppercase">
                            Get Started
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 bg-background">
                <video
                    autoPlay loop muted playsInline
                    poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-network-31628-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
            </div>

            <div className="relative z-10 text-center max-w-7xl mx-auto px-6 w-full mt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[7rem] font-light tracking-tighter text-foreground mb-8 leading-[1.1]"
                >
                    Secure <br className="md:hidden" /> Document Approval.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl font-light text-foreground/70 max-w-3xl mx-auto mb-16 tracking-wide leading-relaxed"
                >
                    A secure and simple way to upload, review, and approve documents for your organization.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/register" className="inline-flex items-center gap-4 border-b border-foreground/30 pb-3 text-foreground hover:border-foreground hover:gap-6 transition-all duration-500 uppercase tracking-widest text-sm font-light">
                        <span>Learn More</span>
                        <ArrowRight strokeWidth={1} className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const SplitSection = ({ title, desc, videoSrc, posterSrc, reverse }: { title: string, desc: string, videoSrc?: string, posterSrc: string, reverse?: boolean }) => {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row bg-background overflow-hidden border-t border-foreground/10">
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 ${reverse ? 'lg:order-2' : ''}`}>
                <div className="max-w-xl text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-foreground mb-10 tracking-tighter leading-tight">{title}</h2>
                        <p className="text-lg md:text-xl font-light text-foreground/50 leading-relaxed">{desc}</p>
                    </motion.div>
                </div>
            </div>
            <div className={`w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full ${reverse ? 'lg:order-1' : ''} overflow-hidden group`}>
                <div className="absolute inset-0 w-full h-full transform group-hover:scale-105 transition-transform duration-[2s] ease-out">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent lg:bg-gradient-to-${reverse ? 'l' : 'r'} lg:from-black lg:via-black/50 lg:to-transparent z-10`} />

                    {videoSrc ? (
                        <video
                            autoPlay loop muted playsInline
                            poster={posterSrc}
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <img src={posterSrc} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    )}
                </div>
            </div>
        </section>
    );
};

const ImmersiveCTA = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden border-t border-foreground/10">
            <div className="absolute inset-0 bg-background z-0">
                <video
                    autoPlay loop muted playsInline
                    poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 object-center"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-technology-network-connections-loop-31627-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
            </div>

            <div className="relative z-10 max-w-4xl px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground tracking-tighter mb-12 leading-tight"
                >
                    Ready to <br className="hidden md:block" /> get started?
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/register" className="inline-block px-12 py-5 bg-foreground text-background font-medium tracking-widest uppercase text-xs hover:bg-foreground/90 hover:scale-[1.02] transition-all duration-500">
                        Sign Up Now
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-background py-16 lg:py-24 border-t border-foreground/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
                <Lock strokeWidth={1} className="w-5 h-5 text-foreground/50" />
                <span className="font-light text-xs tracking-widest uppercase text-foreground/50">SecurePortal</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-xs font-light tracking-widest uppercase text-foreground/40">
                <a href="#" className="hover:text-foreground transition-colors duration-300">Platform</a>
                <a href="#" className="hover:text-foreground transition-colors duration-300">Documentation</a>
                <a href="#" className="hover:text-foreground transition-colors duration-300">Security</a>
                <a href="#" className="hover:text-foreground transition-colors duration-300">Privacy</a>
            </div>

            <div className="text-foreground/40 text-xs font-light tracking-widest uppercase">
                © {new Date().getFullYear()} SECUREPORTAL INC.
            </div>
        </div>
    </footer>
);

export default function Landing() {
    return (
        <div className="bg-background min-h-screen text-foreground font-sans overflow-x-hidden selection:bg-foreground/20 selection:text-foreground">
            <Nav />
            <main>
                <Hero />

                <SplitSection
                    title="Secure Document History."
                    desc="Every action is securely recorded, giving you a complete history of who approved what and when."
                    posterSrc="https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=2070&auto=format&fit=crop"
                    videoSrc="https://assets.mixkit.co/videos/preview/mixkit-data-center-server-room-2965-large.mp4"
                />

                <SplitSection
                    title="Simple Approval Routing."
                    desc="Easily route documents to the right approver. Keep your business moving with a streamlined and reliable workflow."
                    posterSrc="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
                    reverse
                />

                <section id="platform" className="w-full min-h-screen flex items-center bg-background border-t border-foreground/10 py-24 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay loop muted playsInline
                            poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 mix-blend-luminosity"
                        >
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-technology-network-connections-loop-31627-large.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
                    </div>
                    <div className="max-w-7xl mx-auto w-full relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-20 space-y-4 max-w-2xl">
                            <h2 className="text-sm uppercase tracking-[0.3em] text-foreground/40 font-light">The Platform</h2>
                            <h3 className="text-4xl md:text-6xl font-light tracking-tighter text-foreground leading-[1.1]">Engineered for smooth enterprise workflows.</h3>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Role-Based Access', desc: 'Granular permissions ensure employees only access what they upload, while admins have full ledger oversight.' },
                                { title: 'Seamless Routing', desc: 'Securely route any sensitive document directly to a designated approver via encrypted endpoints.' },
                                { title: 'Ledger Transparency', desc: 'Every action—from upload to final approval—is permanently recorded, providing unalterable audit trails.' }
                            ].map((feature, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1 }} className="p-10 border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors group">
                                    <div className="w-12 h-[1px] bg-foreground/30 mb-8 group-hover:w-full transition-all duration-700 ease-out" />
                                    <h4 className="text-xl font-light text-foreground mb-4">{feature.title}</h4>
                                    <p className="text-sm font-light text-foreground/50 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="technology" className="w-full min-h-screen flex items-center bg-background border-t border-foreground/10 py-24 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay loop muted playsInline
                            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                            className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 mix-blend-luminosity"
                        >
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-blue-network-31628-large.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
                    <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col md:flex-row gap-16 items-center">
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex-1 space-y-8">
                            <div>
                                <h2 className="text-sm uppercase tracking-[0.3em] text-foreground/40 font-light mb-4">Under The Hood</h2>
                                <h3 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tighter text-foreground leading-tight">Built with uncompromised technology.</h3>
                            </div>
                            <p className="text-lg font-light text-foreground/50 leading-relaxed max-w-lg">
                                SecurePortal runs on a modern stack designed for high performance and absolute reliability. Our infrastructure relies on secure JWT authentication mechanisms, advanced anti-bot verification measures, and highly optimized data pipelines.
                            </p>

                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-0">
                            {[
                                'End-to-End Encryption', 'JWT Identity Management',
                                'Captcha Bot-Protection', 'React Performance layer',
                                'MongoDB Document Native', 'Realtime Interactivity'
                            ].map((tech, i) => (
                                <div key={i} className="py-6 border-b border-foreground/10 flex items-center justify-between group cursor-default">
                                    <span className="text-xs uppercase tracking-widest text-foreground/70 group-hover:text-foreground transition-colors font-light">{tech}</span>
                                    <ArrowRight strokeWidth={1} className="w-4 h-4 text-foreground/20 group-hover:text-foreground group-hover:translate-x-2 transition-all" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section id="company" className="w-full min-h-screen flex items-center justify-center bg-black border-t border-foreground/10 py-24 px-6 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black z-0" />
                    
                    <div className="max-w-4xl mx-auto relative z-10">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                            <Lock strokeWidth={1} className="w-12 h-12 text-foreground/30 mx-auto mb-10" />
                            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-foreground leading-[1.4] mb-12">
                                "We built SecurePortal because legacy approval processes were too fragmented, insecure, and ultimately holding modern enterprises back."
                            </h2>
                            <p className="text-xs uppercase tracking-[0.3em] font-medium text-foreground/50 mb-16">The SecurePortal Team</p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <a href="mailto:contact@secureportal.demo" className="px-10 py-4 border border-foreground/30 text-foreground text-xs font-medium tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300">
                                    Contact Sales
                                </a>
                                <Link to="/register" className="px-10 py-4 bg-foreground text-background text-xs font-medium tracking-widest uppercase hover:bg-foreground/90 transition-all duration-300">
                                    Try For Free
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <ImmersiveCTA />
            </main>
            <Footer />
        </div>
    );
}
