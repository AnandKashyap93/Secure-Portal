import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { FileUp, CheckCircle, XCircle, Clock, LogOut, AlertTriangle, User as UserIcon, Trash2, FileText } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';
import { format } from 'date-fns';

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.approverEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.status.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const stats = {
        total: documents.length,
        pending: documents.filter(d => d.status === 'pending').length,
        approved: documents.filter(d => d.status === 'approved').length,
        rejected: documents.filter(d => d.status === 'rejected').length
    };

    const [approverEmail, setApproverEmail] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    const fetchDocs = useCallback(async () => {
        const { data } = await api.get('/documents');
        setDocuments(data);
    }, []);

    useEffect(() => {
        fetchDocs();
        const interval = setInterval(fetchDocs, 5000);
        return () => clearInterval(interval);
    }, [fetchDocs]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0 || !approverEmail) return alert('Please provide an approver email');
        setUploading(true);
        const formData = new FormData();
        formData.append('document', acceptedFiles[0]);
        formData.append('title', acceptedFiles[0].name);
        formData.append('approverEmail', approverEmail);
        formData.append('isUrgent', String(isUrgent));

        try {
            await api.post('/documents', formData);
            setApproverEmail('');
            setIsUrgent(false);
            fetchDocs();
        } catch (e) {
            console.error(e);
            alert('Upload failed. Ensure approver email is valid.');
        } finally {
            setUploading(false);
        }
    }, [approverEmail, isUrgent, fetchDocs]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this pending document?')) return;
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(docs => docs.filter(d => d._id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete document');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-950 via-background to-neutral-950 text-foreground font-sans overflow-hidden relative">
            {/* Minimalist Background Layout */}
            <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-blue-500/[0.08] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24 relative z-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-12 mb-12 border-b border-foreground/10">
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-2">User Dashboard</h1>
                        <p className="text-sm font-light text-foreground/50 tracking-wider uppercase">Upload and manage your documents</p>
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
                        <div className="flex gap-4 border-l border-foreground/20 pl-6 items-center">
                            <button onClick={() => setIsProfileOpen(true)} className="text-foreground/40 hover:text-foreground transition-colors" title="Settings">
                                <UserIcon strokeWidth={1} width={20} />
                            </button>
                            <button onClick={logout} className="text-foreground/40 hover:text-foreground transition-colors" title="Disconnect">
                                <LogOut strokeWidth={1} width={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Global Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:-translate-y-1 transition-all duration-500">
                        <FileText strokeWidth={1} className="text-foreground/30 mb-4 group-hover:text-blue-400 transition-colors relative z-10" size={20} />
                        <h2 className="text-3xl font-light tracking-tighter text-foreground mb-1">{stats.total}</h2>
                        <p className="text-foreground/40 text-[9px] uppercase tracking-[0.2em]">Total Uploads</p>
                    </div>
                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-500/50 hover:bg-amber-500/[0.02] hover:-translate-y-1 transition-all duration-500">
                        <Clock strokeWidth={1} className="text-foreground/30 mb-4 group-hover:text-amber-400 transition-colors relative z-10" size={20} />
                        <h2 className="text-3xl font-light tracking-tighter text-foreground mb-1">{stats.pending}</h2>
                        <p className="text-foreground/40 text-[9px] uppercase tracking-[0.2em]">Pending Review</p>
                    </div>
                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 hover:bg-green-500/[0.02] hover:-translate-y-1 transition-all duration-500">
                        <CheckCircle strokeWidth={1} className="text-foreground/30 mb-4 group-hover:text-green-400 transition-colors relative z-10" size={20} />
                        <h2 className="text-3xl font-light tracking-tighter text-foreground mb-1">{stats.approved}</h2>
                        <p className="text-foreground/40 text-[9px] uppercase tracking-[0.2em]">Approved</p>
                    </div>
                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 relative overflow-hidden group hover:border-red-500/50 hover:bg-red-500/[0.02] hover:-translate-y-1 transition-all duration-500">
                        <XCircle strokeWidth={1} className="text-foreground/30 mb-4 group-hover:text-red-400 transition-colors relative z-10" size={20} />
                        <h2 className="text-3xl font-light tracking-tighter text-foreground mb-1">{stats.rejected}</h2>
                        <p className="text-foreground/40 text-[9px] uppercase tracking-[0.2em]">Rejected</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Upload */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <h2 className="text-xs uppercase tracking-[0.2em] font-light text-foreground/40 mb-6">Upload Document</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-foreground/40 font-light mb-2 block uppercase tracking-[0.2em]">Approver Email</label>
                                    <input
                                        type="email"
                                        value={approverEmail}
                                        onChange={e => setApproverEmail(e.target.value)}
                                        placeholder="approver@enterprise.com"
                                        className="w-full bg-foreground/[0.02] backdrop-blur-md border border-foreground/20 p-4 rounded-xl outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all font-light placeholder:text-foreground/20"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input type="checkbox" className="sr-only peer" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} />
                                        <div className="w-11 h-6 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground/50 after:border-foreground/50 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground peer-checked:after:bg-background transition-colors duration-300"></div>
                                        <span className="ml-4 text-xs font-light tracking-[0.2em] uppercase text-foreground/60 group-hover:text-foreground transition-colors">Mark as Urgent</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div
                            {...getRootProps()}
                            className={`border border-foreground/20 p-12 text-center transition-all duration-500 flex flex-col items-center justify-center gap-6 min-h-[300px] rounded-2xl relative overflow-hidden group
                              ${isDragActive ? 'border-blue-500/50 bg-blue-500/[0.02] scale-[1.02] shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.05)]'}
                              ${!approverEmail ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <input {...getInputProps()} disabled={!approverEmail} />
                            <FileUp strokeWidth={1} width={40} height={40} className={`transition-colors ${isDragActive ? 'text-blue-400' : 'text-foreground/60 group-hover:text-blue-400/80'}`} />
                            {uploading ? (
                                <p className="text-foreground font-light tracking-[0.2em] uppercase text-xs animate-pulse">Uploading...</p>
                            ) : isDragActive ? (
                                <p className="text-foreground font-light tracking-[0.2em] uppercase text-xs">Drop file here...</p>
                            ) : !approverEmail ? (
                                <p className="text-foreground/40 font-light tracking-[0.2em] uppercase text-[10px] leading-relaxed max-w-[200px]">Please enter an approver email first.</p>
                            ) : (
                                <div>
                                    <p className="text-foreground font-light tracking-[0.1em] text-sm mb-2">Click or drag file here</p>
                                    <p className="text-foreground/40 uppercase tracking-[0.2em] text-[10px]">PDF or DOCX format</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Ledger Logs */}
                    <div className="lg:col-span-8 lg:pl-12 lg:border-l border-foreground/10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-foreground/10 pb-4">
                            <h2 className="text-xs uppercase tracking-[0.2em] font-light text-foreground/40 m-0">Document History</h2>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                                    className="bg-transparent border-b border-foreground/20 py-2 text-[10px] uppercase tracking-[0.2em] text-foreground focus:border-foreground outline-none transition-colors cursor-pointer *:bg-background *:text-foreground"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                                <div className="relative flex-1 sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="SEARCH DOCUMENTS..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-b border-foreground/20 py-2 pl-2 pr-2 text-[10px] uppercase tracking-[0.2em] text-foreground placeholder:text-foreground/20 focus:border-foreground outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredDocs.map((doc, i) => (
                                <motion.div
                                    key={doc._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between group transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] hover:-translate-y-1
                                        ${doc.isUrgent && doc.status === 'pending' ? 'border-foreground/30 bg-foreground/[0.05]' : 'hover:border-foreground/30'}
                                    `}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            {doc.isUrgent && doc.status === 'pending' && <AlertTriangle strokeWidth={1} size={16} className="text-foreground animate-pulse" />}
                                            <h3 className="font-light text-xl tracking-wide truncate max-w-[300px]" title={doc.title}>
                                                {doc.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-6 mt-3">
                                            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-foreground/40">Approver: <span className="text-foreground/70">{doc.approverEmail}</span></p>
                                            <p className="text-[10px] font-light tracking-[0.2em] uppercase text-foreground/40 hidden sm:block">Date: <span className="text-foreground/70">{format(new Date(doc.createdAt), 'MMM d, yy')}</span></p>
                                        </div>
                                        {doc.comments && doc.comments.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-foreground/10">
                                                <p className="text-[10px] font-light tracking-[0.2em] uppercase text-foreground/30 mb-2">Approver Comment</p>
                                                <p className="text-sm font-light text-foreground/80 border-l border-foreground/30 pl-4">"{doc.comments[doc.comments.length - 1].text}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col md:w-48 items-end justify-center gap-3">
                                        {doc.status === 'pending' && <span className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground/60 border border-foreground/20 rounded-full px-4 py-2 bg-foreground/[0.03] backdrop-blur-md shadow-sm w-full justify-center"><Clock size={12} strokeWidth={1.5} /> Pending</span>}
                                        {doc.status === 'approved' && <span className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-background bg-foreground rounded-full px-4 py-2 shadow-md shadow-foreground/20 w-full justify-center"><CheckCircle size={12} strokeWidth={1.5} /> Verified</span>}
                                        {doc.status === 'rejected' && <span className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-foreground border border-foreground/50 rounded-full px-4 py-2 bg-red-500/10 text-red-500 border-red-500/30 shadow-md w-full justify-center"><XCircle size={12} strokeWidth={1.5} /> Rejected</span>}
                                        
                                        {doc.status === 'pending' && (
                                            <button 
                                                onClick={() => handleDelete(doc._id)}
                                                className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-full px-4 py-2 transition-all w-full md:w-auto"
                                                title="Delete pending document"
                                            >
                                                <Trash2 size={12} strokeWidth={1.5} /> Delete
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {filteredDocs.length === 0 && (
                                <div className="py-24 text-center border border-foreground/10 text-foreground/40 font-light tracking-[0.2em] uppercase text-xs">
                                    No documents found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}
