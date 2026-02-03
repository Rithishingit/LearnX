import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { motion } from 'framer-motion';
import { 
    Users, BookOpen, DollarSign, TrendingUp, Shield, Settings, 
    UserCheck, UserX, Eye, BarChart3, AlertCircle, CheckCircle,
    Clock, Award, Activity, PieChart, ArrowUpRight, ArrowDownRight,
    Search, Filter, MoreVertical, Mail, Trash2, Edit
} from 'lucide-react';
import { toast } from 'react-toastify';

const timeAgo = (date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const diffMs = Date.now() - d.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
};

const formatINR = (n) => {
    const num = typeof n === 'number' ? n : Number(n || 0);
    return `₹${(Number.isFinite(num) ? num : 0).toLocaleString()}`;
};

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingReviews: 0,
        totalReviews: 0,
    });
    const [overview, setOverview] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            // Fetch overview stats/activity computed from DB
            const overviewRes = await API.get('/admin/overview');
            const overviewData = overviewRes.data?.data;
            setOverview(overviewData);

            const computedStats = overviewData?.stats || {};
            setStats({
                totalUsers: computedStats.totalUsers || 0,
                totalCourses: computedStats.totalCourses || 0,
                totalEnrollments: computedStats.totalEnrollments || 0,
                totalRevenue: computedStats.totalRevenue || 0,
                activeUsers: computedStats.activeUsers || 0,
                pendingReviews: computedStats.pendingReviews || 0,
                totalReviews: computedStats.totalReviews || 0,
            });

            // Fetch all users (admin-only endpoint)
            const usersRes = await API.get('/users');
            const usersData = usersRes.data?.data || [];
            setUsers(usersData);

            // Fetch all courses
            const coursesRes = await API.get('/courses');
            const coursesData = coursesRes.data?.data || [];
            setCourses(coursesData);

        } catch (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.put(`/users/${userId}`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/users/${userId}`);
            toast.success('User deleted successfully');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Admin Control Center</h1>
                                <p className="text-slate-400">Platform management & analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: PieChart },
                        { id: 'users', label: 'User Management', icon: Users },
                        { id: 'courses', label: 'Course Management', icon: BookOpen },
                        { id: 'revenue', label: 'Revenue', icon: DollarSign },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { 
                                    label: 'Total Users', 
                                    value: stats.totalUsers, 
                                    icon: Users, 
                                    sub: `+${overview?.last7Days?.newUsers ?? 0} last 7d`,
                                    color: 'from-blue-500 to-indigo-600'
                                },
                                { 
                                    label: 'Total Courses', 
                                    value: stats.totalCourses, 
                                    icon: BookOpen, 
                                    sub: `+${overview?.last7Days?.newCourses ?? 0} last 7d`,
                                    color: 'from-emerald-500 to-teal-600'
                                },
                                { 
                                    label: 'Enrollments', 
                                    value: stats.totalEnrollments, 
                                    icon: UserCheck, 
                                    sub: `+${overview?.last7Days?.newEnrollments ?? 0} last 7d`,
                                    color: 'from-purple-500 to-pink-600'
                                },
                                { 
                                    label: 'Platform Revenue', 
                                    value: formatINR(stats.totalRevenue), 
                                    icon: DollarSign, 
                                    sub: 'Paid enrollments only',
                                    color: 'from-amber-500 to-orange-600'
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {stat.sub}
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {(overview?.recentActivity || []).length === 0 ? (
                                        <div className="text-sm text-slate-400">No activity yet.</div>
                                    ) : (
                                        (overview?.recentActivity || []).map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                                <div>
                                                    <p className="text-white text-sm">{item.action}</p>
                                                    <p className="text-slate-500 text-xs">{item.detail}</p>
                                                </div>
                                                <span className="text-xs text-slate-500">{timeAgo(item.at)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                                    Platform Health
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">DB Status</span>
                                        <span className={`text-sm font-medium ${overview?.system?.dbStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {overview?.system?.dbStatus || 'unknown'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Server Uptime</span>
                                        <span className="text-sm font-medium text-white">{overview?.system?.serverUptimeHuman || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Active Streak Users</span>
                                        <span className="text-sm font-medium text-white">{stats.activeUsers}</span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Completion Rate</span>
                                            <span className="text-white font-medium">{overview?.quality?.completionRate ?? 0}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-500 rounded-full"
                                                style={{ width: `${Math.min(100, Math.max(0, overview?.quality?.completionRate ?? 0))}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Avg Rating</span>
                                            <span className="text-white font-medium">{overview?.quality?.avgRating ?? 0} / 5</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${Math.min(100, Math.max(0, (overview?.quality?.avgRating ?? 0) * 20))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Role Distribution */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">User Distribution by Role</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { role: 'Students', count: users.filter(u => u.role === 'student').length, color: 'from-blue-500 to-indigo-600', icon: '🎓' },
                                    { role: 'Instructors', count: users.filter(u => u.role === 'instructor').length, color: 'from-emerald-500 to-teal-600', icon: '👨‍🏫' },
                                    { role: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'from-red-500 to-orange-600', icon: '🛡️' },
                                ].map((item, i) => (
                                    <div key={i} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center`}>
                                        <div className="text-3xl mb-2">{item.icon}</div>
                                        <p className="text-2xl font-bold text-white">{item.count}</p>
                                        <p className="text-white/80 text-sm">{item.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Search & Filter */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Points</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((u) => (
                                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                            {u.name?.charAt(0)?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{u.name}</p>
                                                            <p className="text-slate-500 text-sm">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                        disabled={u._id === user.id}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500 ${
                                                            u.role === 'admin' 
                                                                ? 'bg-red-500/20 text-red-400' 
                                                                : u.role === 'instructor'
                                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                                    : 'bg-blue-500/20 text-blue-400'
                                                        } ${u._id === user.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="instructor">Instructor</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-white">{u.points || 0}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                        {u._id !== user.id && (
                                                            <button 
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div 
                                    key={course._id}
                                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                                >
                                    <div 
                                        className="h-32 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${course.thumbnail || '/api/placeholder/400/200'})` }}
                                    />
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold mb-2 line-clamp-1">{course.title}</h3>
                                        <p className="text-slate-400 text-sm mb-3">by {course.instructor?.name || 'Unknown'}</p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">{course.studentsEnrolled || 0} students</span>
                                            <span className="text-emerald-400 font-medium">₹{course.price || 'Free'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Revenue Tab */}
                {activeTab === 'revenue' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20">
                                <DollarSign className="w-8 h-8 text-emerald-400 mb-4" />
                                <p className="text-3xl font-bold text-white mb-1">₹{stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-emerald-400">Total Revenue</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
                                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                                <p className="text-3xl font-bold text-white mb-1">₹{Math.floor(stats.totalRevenue * 0.15).toLocaleString()}</p>
                                <p className="text-blue-400">Platform Commission (15%)</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
                                <Award className="w-8 h-8 text-purple-400 mb-4" />
                                <p className="text-3xl font-bold text-white mb-1">{stats.totalEnrollments}</p>
                                <p className="text-purple-400">Total Transactions</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Top Earning Courses</h3>
                            <div className="space-y-4">
                                {courses
                                    .sort((a, b) => ((b.studentsEnrolled || 0) * (b.price || 0)) - ((a.studentsEnrolled || 0) * (a.price || 0)))
                                    .slice(0, 5)
                                    .map((course, i) => (
                                        <div key={course._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 font-bold">
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-white font-medium">{course.title}</p>
                                                    <p className="text-slate-500 text-sm">{course.studentsEnrolled || 0} enrollments</p>
                                                </div>
                                            </div>
                                            <span className="text-emerald-400 font-bold">
                                                ₹{((course.studentsEnrolled || 0) * (course.price || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
