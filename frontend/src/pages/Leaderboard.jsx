import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Trophy, Crown, Medal, Star, Flame, Award, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ user }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('all');

    useEffect(() => {
        fetchLeaderboard();
    }, [timeframe]);

    const fetchLeaderboard = async () => {
        try {
            const { data } = await API.get('/auth/leaderboard');
            setLeaders(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const userRank = leaders.findIndex(l => l.id === user?.id) + 1;

    const getRankBadge = (rank) => {
        switch (rank) {
            case 1: return { icon: '🥇', color: 'from-amber-400 to-yellow-500', glow: 'shadow-amber-400/50' };
            case 2: return { icon: '🥈', color: 'from-gray-300 to-gray-400', glow: 'shadow-gray-400/50' };
            case 3: return { icon: '🥉', color: 'from-orange-400 to-orange-600', glow: 'shadow-orange-400/50' };
            default: return { icon: rank.toString(), color: 'from-indigo-400 to-purple-500', glow: '' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-6 shadow-2xl shadow-amber-500/30">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Leaderboard</h1>
                    <p className="text-white/70 text-lg">Top learners on LearnX</p>
                    
                    {userRank > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.3 }}
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                        >
                            <Star className="w-5 h-5 text-amber-400" />
                            <span className="text-white font-semibold">Your Rank: #{userRank}</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Top 3 Podium */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-end gap-4 mb-12"
                >
                    {/* Second Place */}
                    {leaders[1] && (
                        <div className="text-center">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-4xl shadow-2xl shadow-gray-400/30"
                            >
                                🥈
                            </motion.div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 w-36">
                                <p className="font-bold text-white truncate">{leaders[1].name}</p>
                                <p className="text-amber-400 font-semibold">{leaders[1].points} XP</p>
                                <p className="text-xs text-white/50">Level {leaders[1].level}</p>
                            </div>
                            <div className="mt-2 h-24 bg-gradient-to-t from-gray-500/30 to-gray-400/10 rounded-t-xl"></div>
                        </div>
                    )}

                    {/* First Place */}
                    {leaders[0] && (
                        <div className="text-center -mt-8">
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.5 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                                className="relative"
                            >
                                <Crown className="w-8 h-8 text-amber-400 absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce" />
                                <div className="w-28 h-28 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-5xl shadow-2xl shadow-amber-400/50 ring-4 ring-amber-300/30">
                                    🥇
                                </div>
                            </motion.div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-amber-400/30 w-40">
                                <p className="font-bold text-white truncate">{leaders[0].name}</p>
                                <p className="text-amber-400 font-bold text-lg">{leaders[0].points} XP</p>
                                <p className="text-xs text-white/50">Level {leaders[0].level}</p>
                            </div>
                            <div className="mt-2 h-32 bg-gradient-to-t from-amber-500/30 to-amber-400/10 rounded-t-xl"></div>
                        </div>
                    )}

                    {/* Third Place */}
                    {leaders[2] && (
                        <div className="text-center">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl shadow-2xl shadow-orange-400/30"
                            >
                                🥉
                            </motion.div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 w-36">
                                <p className="font-bold text-white truncate">{leaders[2].name}</p>
                                <p className="text-amber-400 font-semibold">{leaders[2].points} XP</p>
                                <p className="text-xs text-white/50">Level {leaders[2].level}</p>
                            </div>
                            <div className="mt-2 h-20 bg-gradient-to-t from-orange-500/30 to-orange-400/10 rounded-t-xl"></div>
                        </div>
                    )}
                </motion.div>

                {/* Full Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            All Learners
                        </h2>
                    </div>
                    
                    <div className="divide-y divide-white/10">
                        {leaders.slice(3).map((leader, index) => {
                            const rank = index + 4;
                            const isCurrentUser = leader.id === user?.id;
                            
                            return (
                                <motion.div
                                    key={leader.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.05 }}
                                    className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-all ${
                                        isCurrentUser ? 'bg-indigo-500/20' : ''
                                    }`}
                                >
                                    <span className="w-10 text-center font-bold text-white/50 text-lg">
                                        #{rank}
                                    </span>
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                        {leader.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white flex items-center gap-2">
                                            {leader.name}
                                            {isCurrentUser && (
                                                <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded-full">You</span>
                                            )}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                Level {leader.level}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Medal className="w-3 h-3" />
                                                {leader.badgeCount} badges
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-amber-400">{leader.points}</p>
                                        <p className="text-xs text-white/50">XP</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {leaders.length === 0 && (
                        <div className="p-12 text-center">
                            <Trophy className="w-12 h-12 text-white/30 mx-auto mb-4" />
                            <p className="text-white/50">No learners yet. Be the first!</p>
                        </div>
                    )}
                </motion.div>

                {/* How to Earn Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        How to Earn XP
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 text-white/70">
                            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-lg">📚</span>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Complete Lesson</p>
                                <p className="text-sm">+50 XP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-lg">✅</span>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Pass Quiz</p>
                                <p className="text-sm">+100 XP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-lg">🏆</span>
                            </div>
                            <div>
                                <p className="font-semibold text-white">Complete Course</p>
                                <p className="text-sm">+500 XP</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Leaderboard;
