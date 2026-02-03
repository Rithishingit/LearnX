import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Calendar, Trophy, X, Star, Zap } from 'lucide-react';
import API from '../services/api';

const StreakWidget = ({ user, onClose }) => {
    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [celebrating, setCelebrating] = useState(false);

    useEffect(() => {
        if (user) {
            checkAndUpdateStreak();
        }
    }, [user]);

    const checkAndUpdateStreak = async () => {
        try {
            const { data } = await API.put('/auth/streak');
            setStreakData(data);
            if (data.streak?.current > 0 && data.message !== 'Already logged today') {
                setCelebrating(true);
                setTimeout(() => setCelebrating(false), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStreakMessage = (days) => {
        if (days >= 100) return "Incredible! You're a legend! 🏆";
        if (days >= 30) return "Amazing dedication! 💪";
        if (days >= 7) return "You're on fire! 🔥";
        if (days >= 3) return "Keep it up! 💫";
        if (days >= 1) return "Great start! ⭐";
        return "Start your streak today!";
    };

    const getStreakColor = (days) => {
        if (days >= 30) return 'from-amber-500 to-red-500';
        if (days >= 7) return 'from-orange-500 to-red-500';
        return 'from-orange-400 to-orange-600';
    };

    // Get week days for display
    const getWeekDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            days.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
                date: date.getDate(),
                isToday: i === 0,
                isPast: i > 0,
            });
        }
        return days;
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    const currentStreak = streakData?.streak?.current || 0;
    const longestStreak = streakData?.streak?.longest || 0;
    const weekDays = getWeekDays();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full"
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getStreakColor(currentStreak)} p-6 relative overflow-hidden`}>
                    {/* Celebration particles */}
                    {celebrating && (
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ 
                                        opacity: 1, 
                                        scale: 0,
                                        x: Math.random() * 200 - 100,
                                        y: Math.random() * 200 - 100 
                                    }}
                                    animate={{ 
                                        opacity: 0, 
                                        scale: 1,
                                        y: -100 
                                    }}
                                    transition={{ 
                                        duration: 1.5,
                                        delay: Math.random() * 0.5 
                                    }}
                                    className="absolute left-1/2 top-1/2 text-2xl"
                                >
                                    {['🔥', '⭐', '✨', '💪'][Math.floor(Math.random() * 4)]}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <div className="text-center">
                        <motion.div
                            animate={celebrating ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4"
                        >
                            <Flame className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.div
                            animate={celebrating ? { scale: [1, 1.1, 1] } : {}}
                            className="text-6xl font-bold text-white mb-2"
                        >
                            {currentStreak}
                        </motion.div>
                        <p className="text-white/90 font-medium">Day Streak</p>
                        <p className="text-white/70 text-sm mt-1">{getStreakMessage(currentStreak)}</p>
                    </div>
                </div>

                {/* Week Progress */}
                <div className="p-6 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">This Week</h3>
                    <div className="flex justify-between">
                        {weekDays.map((day, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-xs text-gray-400 mb-2">{day.day}</span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold ${
                                    day.isToday 
                                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg' 
                                        : day.isPast && currentStreak >= (7 - i)
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {day.isToday ? <Flame className="w-5 h-5" /> : day.date}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <Calendar className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
                            <p className="text-sm text-gray-500">Longest Streak</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">{streakData?.points || 0}</p>
                            <p className="text-sm text-gray-500">Total XP</p>
                        </div>
                    </div>
                </div>

                {/* Motivation */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Keep learning!</p>
                            <p className="text-sm text-gray-600">Complete a lesson today to maintain your streak</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StreakWidget;
