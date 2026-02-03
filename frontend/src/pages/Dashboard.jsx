import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
    Play, CheckCircle, Clock, BookOpen, Flame, Trophy, ArrowRight, 
    Calendar, Target, Star, Award, Zap, TrendingUp, Medal, Crown,
    Gift, Sparkles, ChevronRight, Users, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Certificate from '../components/Certificate';

const Dashboard = ({ user }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('learning');
    const [showCertificate, setShowCertificate] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [enrollRes, statsRes, leaderRes] = await Promise.all([
                API.get('/users/enrollments'),
                API.get('/auth/stats').catch(() => ({ data: { data: null } })),
                API.get('/auth/leaderboard').catch(() => ({ data: { data: [] } })),
            ]);
            setEnrollments(enrollRes.data.data || []);
            setStats(statsRes.data.data);
            setLeaderboard(leaderRes.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const getLevelProgress = () => {
        if (!stats) return 0;
        const pointsInLevel = stats.points % 500;
        return (pointsInLevel / 500) * 100;
    };

    const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
                            </h1>
                            <p className="text-gray-600">Ready to continue your learning journey?</p>
                        </div>
                        
                        {/* Level Badge */}
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Crown className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/80">Level</p>
                                        <p className="text-2xl font-bold">{stats?.level || 1}</p>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-xs text-white/80">{stats?.points || 0} XP</p>
                                        <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getLevelProgress()}%` }}
                                                className="h-full bg-white rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
                        <p className="text-sm text-gray-600">Courses Enrolled</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">Done</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.coursesCompleted || 0}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <Flame className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-full">Streak</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.streak?.current || 0}</p>
                        <p className="text-sm text-gray-600">Day Streak 🔥</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-xl">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-1 rounded-full">Earned</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats?.certificates?.length || 0}</p>
                        <p className="text-sm text-gray-600">Certificates</p>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { id: 'learning', label: 'My Learning', icon: BookOpen },
                        { id: 'badges', label: 'Badges & Achievements', icon: Medal },
                        { id: 'certificates', label: 'Certificates', icon: Award },
                        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'learning' && (
                        <motion.div
                            key="learning"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid lg:grid-cols-3 gap-6"
                        >
                            {/* Continue Learning */}
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                                
                                {enrollments.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="w-8 h-8 text-indigo-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
                                        <p className="text-gray-600 mb-6">Start your learning journey today!</p>
                                        <Link
                                            to="/courses"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            Browse Courses
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {enrollments.map((enrollment, index) => (
                                            <motion.div
                                                key={enrollment._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                        <img 
                                                            src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
                                                            alt={enrollment.course?.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                            {enrollment.course?.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                                <motion.div 
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${enrollment.progress || 0}%` }}
                                                                    transition={{ duration: 1 }}
                                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                                />
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-600">
                                                                {enrollment.progress || 0}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">
                                                                {enrollment.completed ? '✅ Completed' : 'In Progress'}
                                                            </span>
                                                            <Link
                                                                to={`/learn/${enrollment.course?._id}`}
                                                                className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all"
                                                            >
                                                                {enrollment.completed ? 'Review' : 'Continue'}
                                                                <Play className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Daily Goal</h3>
                                        <Target className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-4xl font-bold">{stats?.avgProgress || 0}%</span>
                                        <span className="text-white/70 mb-1">completed</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${stats?.avgProgress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            to="/courses"
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                                        >
                                            <span className="font-medium text-gray-700">Browse Courses</span>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                                        >
                                            <span className="font-medium text-gray-700">Edit Profile</span>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'badges' && (
                        <motion.div
                            key="badges"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Badges & Achievements</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {/* Earned Badges */}
                                {(stats?.badges || []).map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1, type: 'spring' }}
                                        className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                                    >
                                        <div className="text-4xl mb-3">{badge.icon}</div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{badge.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                                    </motion.div>
                                ))}
                                
                                {/* Locked Badges */}
                                {[
                                    { icon: '🏆', name: 'Champion', desc: 'Complete 10 courses' },
                                    { icon: '🔥', name: 'On Fire', desc: '7-day streak' },
                                    { icon: '💯', name: 'Perfectionist', desc: 'Score 100% on quiz' },
                                    { icon: '🚀', name: 'Fast Learner', desc: 'Complete course in 1 day' },
                                    { icon: '📚', name: 'Bookworm', desc: 'Enroll in 5 courses' },
                                    { icon: '⭐', name: 'Rising Star', desc: 'Reach Level 5' },
                                ].filter(b => !(stats?.badges || []).some(ub => ub.name === b.name)).map((badge, index) => (
                                    <div
                                        key={badge.name}
                                        className="bg-gray-100 rounded-2xl p-6 text-center opacity-50"
                                    >
                                        <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                                        <h4 className="font-semibold text-gray-600 text-sm">{badge.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
                                        <span className="text-xs text-gray-400 mt-2 inline-block">🔒 Locked</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'certificates' && (
                        <motion.div
                            key="certificates"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Certificates</h2>
                            
                            {(stats?.certificates || []).length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-amber-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No certificates yet</h3>
                                    <p className="text-gray-600 mb-6">Complete a course to earn your first certificate!</p>
                                    <Link
                                        to="/courses"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Start Learning
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {stats.certificates.map((cert, index) => (
                                        <motion.div
                                            key={cert.certificateId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => setShowCertificate(cert)}
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {cert.courseName}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Issued {new Date(cert.issuedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">ID: {cert.certificateId?.slice(0, 8)}...</span>
                                                <span className="text-indigo-600 text-sm font-semibold">View →</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
                                {userRank > 0 && (
                                    <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold">
                                        Your Rank: #{userRank}
                                    </span>
                                )}
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Top 3 */}
                                <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                                    {leaderboard.slice(0, 3).map((leader, index) => (
                                        <div key={leader.id} className={`text-center ${index === 1 ? 'order-first' : ''}`}>
                                            <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${
                                                index === 0 ? 'from-amber-400 to-yellow-500' :
                                                index === 1 ? 'from-gray-300 to-gray-400' :
                                                'from-orange-400 to-orange-600'
                                            } flex items-center justify-center text-white font-bold text-xl ${
                                                index === 1 ? 'w-20 h-20' : ''
                                            }`}>
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">{leader.name}</h4>
                                            <p className="text-sm text-indigo-600 font-semibold">{leader.points} XP</p>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Rest of leaderboard */}
                                <div className="divide-y divide-gray-100">
                                    {leaderboard.slice(3, 20).map((leader) => (
                                        <div 
                                            key={leader.id}
                                            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-all ${
                                                leader.id === user?.id ? 'bg-indigo-50' : ''
                                            }`}
                                        >
                                            <span className="w-8 text-center font-bold text-gray-400">#{leader.rank}</span>
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {leader.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{leader.name}</h4>
                                                <p className="text-xs text-gray-500">Level {leader.level}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-indigo-600">{leader.points} XP</p>
                                                <p className="text-xs text-gray-500">{leader.badgeCount} badges</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Certificate Modal */}
            <AnimatePresence>
                {showCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowCertificate(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-5xl w-full max-h-[90vh] overflow-auto bg-white rounded-2xl"
                        >
                            <Certificate
                                studentName={user?.name}
                                courseName={showCertificate.courseName}
                                completionDate={showCertificate.issuedAt}
                                certificateId={showCertificate.certificateId}
                                grade={showCertificate.grade || "A"}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
