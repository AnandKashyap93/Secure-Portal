import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, Trash2, Users, CheckSquare, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import ProfileModal from '../components/ProfileModal';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({ totalUsers: 0, totalApprovers: 0, totalDocs: 0, pendingDocs: 0 });
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const changeRole = async (id: string, newRole: string) => {
        try {
            await api.patch(`/users/${id}/role`, { role: newRole });
            fetchData();
        } catch (e: any) {
            alert(e.response?.data?.error || "Role update failed");
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/users'),
                api.get('/stats')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (e) {
            console.error("Failed to fetch admin data", e);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Polling for metrics
        return () => clearInterval(interval);
    }, [fetchData]);

    const removeUser = async (id: string) => {
        if (!confirm("Are you sure you want to completely remove this account?")) return;
        try {
            await api.delete(`/users/${id}`);
            fetchData();
        } catch (e: any) {
            alert(e.response?.data?.error || "Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-slate-900 text-foreground font-sans overflow-hidden relative transition-colors duration-500">
            {/* Cinematic Minimalist Layout */}
            <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-blue-500/[0.08] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-24 relative z-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-12 mb-12 border-b border-foreground/10">
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-light tracking-tighter mb-2 flex items-center gap-4">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm font-light text-foreground/50 tracking-[0.2em] uppercase">Manage users and system statistics</p>
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
                            <button onClick={logout} className="text-foreground/40 hover:text-foreground transition-colors flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase" title="Disconnect">
                                <LogOut strokeWidth={1} width={16} /> <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Global Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <Users strokeWidth={1} className="text-foreground/30 mb-6 group-hover:text-blue-400 transition-colors relative z-10" size={24} />
                        <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-foreground mb-2 relative z-10">{stats.totalUsers}</h2>
                        <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] relative z-10">Active Uploaders</p>
                    </div>

                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <CheckSquare strokeWidth={1} className="text-foreground/30 mb-6 group-hover:text-blue-400 transition-colors relative z-10" size={24} />
                        <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-foreground mb-2 relative z-10">{stats.totalApprovers}</h2>
                        <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] relative z-10">Active Approvers</p>
                    </div>

                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <FileText strokeWidth={1} className="text-foreground/30 mb-6 group-hover:text-blue-400 transition-colors relative z-10" size={24} />
                        <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-foreground mb-2 relative z-10">{stats.totalDocs}</h2>
                        <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] relative z-10">Total Documents</p>
                    </div>

                    <div className="bg-foreground/[0.02] backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 hover:bg-blue-500/[0.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <Activity strokeWidth={1} className="text-foreground/30 mb-6 group-hover:text-blue-400 transition-colors relative z-10" size={24} />
                        <h2 className="text-4xl lg:text-5xl font-light tracking-tighter text-foreground mb-2 relative z-10">{stats.pendingDocs}</h2>
                        <p className="text-foreground/40 text-[10px] uppercase tracking-[0.2em] relative z-10">Pending Actions</p>
                    </div>
                </div>

                {/* User Management Table */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-xs uppercase tracking-[0.2em] font-light text-foreground/40 flex items-center gap-4 m-0">
                            <span className="w-8 h-[1px] bg-foreground/20" /> User Management
                        </h2>

                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="SEARCH USERS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-foreground/[0.02] backdrop-blur-md border border-foreground/20 p-3 rounded-xl text-[10px] uppercase tracking-[0.2em] text-foreground placeholder:text-foreground/20 focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-foreground/10 rounded-3xl bg-foreground/[0.02] backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                        <table className="w-full text-left text-sm text-foreground/60">
                            <thead className="bg-foreground/5 text-foreground/40 text-[10px] uppercase tracking-[0.2em] border-b border-foreground/10">
                                <tr>
                                    <th className="px-8 py-6 font-light">Name</th>
                                    <th className="px-8 py-6 font-light">Email</th>
                                    <th className="px-8 py-6 font-light">Role</th>
                                    <th className="px-8 py-6 font-light">Joined Date</th>
                                    <th className="px-8 py-6 font-light text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                <AnimatePresence>
                                    {users.filter(u =>
                                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        u.role.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map(u => (
                                        <motion.tr exit={{ opacity: 0, scale: 0.99 }} key={u._id} className="hover:bg-foreground/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-light text-foreground tracking-wide">{u.name}</td>
                                            <td className="px-8 py-6 font-light">{u.email}</td>
                                            <td className="px-8 py-6 font-light">
                                                {u.role === 'admin' ? (
                                                    <span className="text-[9px] uppercase tracking-[0.2em] text-foreground font-medium">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => changeRole(u._id, e.target.value)}
                                                        className={`bg-foreground/[0.05] border border-foreground/10 outline-none text-[9px] uppercase tracking-[0.2em] cursor-pointer py-2 px-3 rounded-lg focus:border-foreground/30 transition-colors
                                                            ${u.role === 'user' ? 'text-foreground/60' : 'text-foreground/90'}
                                                        `}
                                                    >
                                                        <option value="user" className="bg-background text-foreground">User</option>
                                                        <option value="approver" className="bg-background text-foreground">Approver</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 font-light text-xs tracking-widest">{format(new Date(u.createdAt), 'dd.MM.yyyy')}</td>
                                            <td className="px-8 py-6 text-right">
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => removeUser(u._id)} className="group text-foreground/30 hover:text-foreground transition-all text-[9px] uppercase tracking-[0.2em] flex items-center justify-end gap-2 w-full" title="Remove User">
                                                        Delete <Trash2 strokeWidth={1} size={14} className="group-hover:text-red-500" />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {users.length === 0 && <div className="p-16 text-center text-foreground/30 font-light tracking-[0.2em] text-xs uppercase">No users found.</div>}
                    </div>
                </div>
            </div>
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}
