import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, XCircle, ExternalLink, MessageSquare, LogOut, Activity, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import ProfileModal from '../components/ProfileModal';

export default function ApproverDashboard() {
    const { user, logout } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);
    const [commentingId, setCommentingId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [filter, setFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');

    const filteredDocs = documents.filter(doc => {
        if (filter === 'pending') return doc.status === 'pending';
        if (filter === 'reviewed') return doc.status !== 'pending';
        return true;
    });

    const fetchDocs = useCallback(async () => {
        const { data } = await api.get('/documents');
        setDocuments(data);
    }, []);

    useEffect(() => {
        fetchDocs();
        const interval = setInterval(fetchDocs, 5000);
        return () => clearInterval(interval);
    }, [fetchDocs]);

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await api.patch(`/documents/${id}`, { status, comment: commentText });
            setCommentingId(null);
            setCommentText('');
            fetchDocs();
        } catch (e) {
            alert('Action failed');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-slate-900 text-foreground font-sans overflow-hidden relative transition-colors duration-500">
            {/* Cinematic Minimalist Grid */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-0" />
            <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-blue-500/[0.05] to-transparent pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24 relative z-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-12 mb-16 border-b border-foreground/10">
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-2">Approver Dashboard</h1>
                        <p className="text-sm font-light text-foreground/50 tracking-[0.2em] uppercase">Review and approve documents</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            {user?.pfpUrl ? (
                                <img src={`http://localhost:5000${user.pfpUrl}`} alt="Profile" className="w-10 h-10 object-cover border border-foreground/20 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:scale-110 transition-transform" />
                            ) : (
                                <div className="w-10 h-10 bg-foreground border border-foreground/20 text-background flex items-center justify-center font-medium rounded-full">{user?.name?.charAt(0)}</div>
                            )}
                            <div className="hidden sm:block">
                                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-1">Logged In As</p>
                                <p className="text-sm font-light leading-none">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 border-l border-foreground/20 pl-6">
                            <button onClick={() => setIsProfileOpen(true)} className="text-foreground/40 hover:text-foreground transition-colors" title="Settings">
                                <UserIcon strokeWidth={1} width={20} />
                            </button>
                            <button onClick={logout} className="text-foreground/40 hover:text-foreground transition-colors" title="Disconnect">
                                <LogOut strokeWidth={1} width={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-5xl space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xs uppercase tracking-[0.2em] font-light text-foreground/50 flex items-center gap-4 m-0">
                            <span className="w-8 h-[1px] bg-foreground/20" /> {filter === 'pending' ? 'Pending Documents' : filter === 'reviewed' ? 'Review History' : 'All Documents'}
                        </h2>

                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium border border-foreground/10 p-1 rounded-full bg-foreground/[0.02] backdrop-blur-md">
                            <button onClick={() => setFilter('pending')} className={`px-6 py-2 transition-all rounded-full ${filter === 'pending' ? 'bg-foreground text-background shadow-lg' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}>Pending</button>
                            <button onClick={() => setFilter('reviewed')} className={`px-6 py-2 transition-all rounded-full ${filter === 'reviewed' ? 'bg-foreground text-background shadow-lg' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}>Reviewed</button>
                            <button onClick={() => setFilter('all')} className={`px-6 py-2 transition-all rounded-full ${filter === 'all' ? 'bg-foreground text-background shadow-lg' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}>All</button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {filteredDocs.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center border border-foreground/10 font-light tracking-[0.2em] text-xs uppercase text-foreground/30 bg-foreground/[0.01]">
                                <FileText strokeWidth={0.5} className="w-12 h-12 mx-auto mb-6 text-foreground/20" />
                                <p>No documents found.</p>
                            </motion.div>
                        )}

                        {filteredDocs.map((doc, i) => (
                            <motion.div
                                key={doc._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: i * 0.05 }}
                                className={`group bg-foreground/[0.02] backdrop-blur-xl border p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-start md:items-center transition-all duration-500 rounded-2xl hover:shadow-[0_0_40px_rgba(59,130,246,0.05)] hover:-translate-y-1
                                    ${doc.isUrgent && doc.status === 'pending' ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-foreground/10 hover:border-blue-500/30'}
                                `}
                            >
                                <div className="flex-1 space-y-6 w-full relative">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            {doc.isUrgent && doc.status === 'pending' && <Activity strokeWidth={1} className="text-amber-500 animate-pulse" />}
                                            <h3 className="font-light text-2xl tracking-wide max-w-sm truncate text-foreground group-hover:text-blue-50 transition-colors" title={doc.title}>{doc.title}</h3>
                                        </div>
                                        <a href={`http://localhost:5000${doc.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-background bg-foreground hover:bg-foreground/80 transition-all px-5 py-2.5 rounded-full mt-4 sm:mt-0 shadow-lg hover:shadow-foreground/20">
                                            <ExternalLink size={12} strokeWidth={2} /> View File
                                        </a>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-[10px] font-light tracking-[0.2em] uppercase text-foreground/40 uppercase">
                                        <p>Uploader: <span className="text-foreground ml-2 lowercase tracking-normal">{doc.uploaderId?.email}</span></p>
                                        <p>Date: <span className="text-foreground ml-2">{format(new Date(doc.createdAt), 'dd.MM.yy HH:mm')}</span></p>
                                    </div>

                                    {doc.comments && doc.comments.length > 0 && (
                                        <div className="pt-6 border-t border-foreground/10 mt-6">
                                            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-foreground/30 mb-2 flex items-center gap-2">
                                                <MessageSquare size={12} strokeWidth={1} /> Comments
                                            </p>
                                            <div className="space-y-4">
                                                {doc.comments.map((c: any, idx: number) => (
                                                    <p key={idx} className="text-sm font-light text-foreground/70 border-l border-foreground/20 pl-4">
                                                        <span className="uppercase text-[9px] tracking-widest text-foreground/40 block mb-1">{c.author}</span>
                                                        "{c.text}"
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-64 min-w-[250px] flex flex-col gap-4 border-t md:border-t-0 md:border-l border-foreground/10 pt-8 md:pt-0 md:pl-8">
                                    {doc.status === 'pending' ? (
                                        <>
                                            {commentingId === doc._id ? (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                    <textarea
                                                        autoFocus
                                                        placeholder="Add a comment..."
                                                        className="w-full bg-transparent border-b border-foreground/20 p-3 text-[10px] uppercase tracking-widest text-foreground outline-none focus:border-foreground min-h-[80px] resize-none font-light placeholder:text-foreground/20"
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                    />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button onClick={() => handleAction(doc._id, 'approved')} className="py-3 bg-foreground text-background text-[10px] uppercase tracking-widest font-medium hover:bg-background hover:text-foreground border border-transparent hover:border-foreground transition-all">Approve</button>
                                                        <button onClick={() => handleAction(doc._id, 'rejected')} className="py-3 border border-foreground/20 text-foreground hover:border-foreground text-[10px] uppercase tracking-widest font-medium transition-all">Reject</button>
                                                    </div>
                                                    <button onClick={() => setCommentingId(null)} className="w-full py-2 text-[9px] uppercase tracking-widest text-foreground/30 hover:text-foreground/70">Cancel</button>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    <button onClick={() => { setCommentingId(doc._id); setCommentText(''); }} className="w-full flex justify-between items-center px-6 py-4 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-medium hover:bg-blue-500 transition-all rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] group/btn">
                                                        Approve <CheckCircle size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                    <button onClick={() => { setCommentingId(doc._id); setCommentText(''); }} className="w-full flex justify-between items-center px-6 py-4 border border-foreground/20 text-foreground text-[10px] uppercase tracking-widest font-medium hover:border-red-500/50 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5 group/btn">
                                                        Deny <XCircle size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                    <p className="text-[9px] uppercase tracking-widest text-foreground/30 text-center mt-2">Optional comment</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={`p-8 border flex flex-col items-center justify-center text-center transition-all rounded-xl backdrop-blur-sm ${doc.status === 'approved' ? 'border-foreground/30 bg-foreground/[0.05] text-foreground' : 'border-foreground/20 bg-transparent text-foreground/60'}`}>
                                            {doc.status === 'approved' ? <CheckCircle strokeWidth={1.5} className="w-10 h-10 mb-2" /> : <XCircle strokeWidth={1.5} className="w-10 h-10 mb-2" />}
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{doc.status}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}
