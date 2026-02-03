import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Star, Users, Play, BookOpen, X } from 'lucide-react';

const Wishlist = ({ user }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [user, navigate]);

    const fetchWishlist = async () => {
        try {
            const { data } = await API.get('/users/wishlist');
            setWishlist(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (courseId) => {
        try {
            await API.delete(`/users/wishlist/${courseId}`);
            setWishlist(prev => prev.filter(c => c._id !== courseId));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="w-10 h-10 text-pink-500" fill="#ec4899" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 mt-2">{wishlist.length} courses saved for later</p>
                    </div>
                </motion.div>

                {wishlist.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {wishlist.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-all"
                                >
                                    <div className="relative h-44 bg-gradient-to-br from-indigo-100 to-purple-100">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-indigo-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Link
                                                to={`/courses/${course._id}`}
                                                className="px-6 py-3 bg-white rounded-xl font-semibold text-gray-900 hover:bg-gray-100 transition-all flex items-center gap-2"
                                            >
                                                <Play className="w-5 h-5" />
                                                View Course
                                            </Link>
                                        </div>
                                        
                                        <button
                                            onClick={() => removeFromWishlist(course._id)}
                                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <Heart className="w-5 h-5" fill="currentColor" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                            {course.category || 'Course'}
                                        </span>
                                        <h3 className="font-bold text-lg text-gray-900 mt-3 line-clamp-2 hover:text-indigo-600 transition-colors">
                                            <Link to={`/courses/${course._id}`}>{course.title}</Link>
                                        </h3>
                                        
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400" fill="#fbbf24" />
                                                {course.averageRating?.toFixed(1) || '4.5'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {course.studentsEnrolled || 0} students
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {course.price === 0 ? (
                                                    <span className="text-green-600">Free</span>
                                                ) : (
                                                    `₹${course.price}`
                                                )}
                                            </div>
                                            <Link
                                                to={`/courses/${course._id}`}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Enroll
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-lg p-16 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Browse our courses and add the ones you love to your wishlist for later!
                        </p>
                        <Link
                            to="/courses"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
                        >
                            <BookOpen className="w-5 h-5" />
                            Browse Courses
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
