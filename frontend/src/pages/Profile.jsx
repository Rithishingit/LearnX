import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, LogOut, BookOpen, Star, Users, Trophy, Award, Flame, Medal, Edit2, Camera, Calendar, TrendingUp, Target, ChevronRight, Settings, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import API, { getMe, logout } from '../services/api';
import Certificate from '../components/Certificate';

const Profile = ({ user, setUser }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showCertificate, setShowCertificate] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                await Promise.all([fetchUserProfile(), fetchEnrollments()]);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const { data } = await getMe();
            setProfileData(data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                setUser(null);
            }
            console.error('Profile fetch error:', error);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const { data } = await API.get('/enrollments/my');
            setEnrollments(data.data || []);
        } catch (error) {
            // Silent fail - just set empty enrollments
            setEnrollments([]);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Please login to view your profile</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Use profileData if available, otherwise fall back to user prop
    const displayData = profileData || user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="relative -mt-20">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                {/* Avatar */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl overflow-hidden">
                                        {profileData?.profilePic && profileData.profilePic !== 'default-avatar.png' ? (
                                            <img 
                                                src={profileData.profilePic.startsWith('http') ? profileData.profilePic : `/uploads/${profileData.profilePic}`} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            profileData?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                        {profileData?.level || 1}
                                    </div>
                                </motion.div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl font-bold text-gray-900">{profileData?.name || user?.name}</h1>
                                        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                            {profileData?.role || user?.role}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 mt-1">{profileData?.email || user?.email}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date(profileData?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            {profileData?.streak?.current || 0} day streak
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="max-w-6xl mx-auto px-6 mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{profileData?.points || 0}</p>
                        <p className="text-gray-500 mt-1">Total XP</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
                        <p className="text-gray-500 mt-1">Courses Enrolled</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{profileData?.certificates?.length || 0}</p>
                        <p className="text-gray-500 mt-1">Certificates</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                            <Medal className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{profileData?.badges?.length || 0}</p>
                        <p className="text-gray-500 mt-1">Badges Earned</p>
                    </motion.div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-6xl mx-auto px-6 mt-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex gap-2">
                    {[
                        { id: 'overview', label: 'My Courses', icon: BookOpen },
                        { id: 'achievements', label: 'Achievements', icon: Trophy },
                        { id: 'certificates', label: 'Certificates', icon: Award }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-6 mt-8">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold">Enrolled Courses</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {enrollments.length > 0 ? (
                                    enrollments.map((enrollment, i) => (
                                        <Link
                                            key={i}
                                            to={`/learn/${enrollment.course?._id}`}
                                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center overflow-hidden">
                                                {enrollment.course?.thumbnail ? (
                                                    <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <BookOpen className="w-8 h-8 text-indigo-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{enrollment.course?.title || 'Course'}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{enrollment.course?.category}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-48">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                                            style={{ width: `${enrollment.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600">{enrollment.progress || 0}%</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {enrollment.completed ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Completed</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">In Progress</span>
                                                )}
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No courses enrolled yet</p>
                                        <Link to="/courses" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">
                                            Browse Courses →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                        >
                            <h2 className="text-xl font-bold mb-6">Badges & Achievements</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {profileData?.badges?.length > 0 ? (
                                    profileData.badges.map((badge, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-2">
                                                {badge.icon || '🏆'}
                                            </div>
                                            <span className="text-sm font-medium text-center">{badge.name}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-12 text-center">
                                        <Medal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No badges earned yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Complete courses to earn badges!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'certificates' && (
                        <motion.div
                            key="certificates"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                        >
                            <h2 className="text-xl font-bold mb-6">Certificates</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileData?.certificates?.length > 0 ? (
                                    profileData.certificates.map((cert, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => setShowCertificate(cert)}
                                            className="cursor-pointer group"
                                        >
                                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 p-6 hover:shadow-xl transition-all hover:border-indigo-300">
                                                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-bold text-lg text-gray-900 mt-8 pr-16">{cert.courseTitle || 'Course Certificate'}</h3>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                                                </p>
                                                <div className="mt-4 text-indigo-600 font-medium group-hover:underline">
                                                    View Certificate →
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full p-12 text-center">
                                        <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No certificates yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Complete a course to earn a certificate!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Certificate Modal */}
            {showCertificate && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCertificate(null)}>
                    <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end p-4">
                            <button 
                                onClick={() => setShowCertificate(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <Certificate
                            studentName={profileData?.name || user?.name}
                            courseName={showCertificate.courseName}
                            instructorName={showCertificate.instructorName || "LearnX Academy"}
                            completionDate={showCertificate.issuedAt || showCertificate.completionDate}
                            certificateId={showCertificate.certificateId}
                            grade={showCertificate.grade || "A"}
                            hoursCompleted={showCertificate.hoursCompleted || 10}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;