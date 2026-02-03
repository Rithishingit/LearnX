import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock, ArrowRight, Play, Heart } from 'lucide-react';
import API from '../services/api';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const CourseCard = ({ course, user }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkWishlist();
        }
    }, [user, course._id]);

    const checkWishlist = async () => {
        try {
            const { data } = await API.get('/users/wishlist');
            const wishlistIds = data.data?.map(c => c._id) || [];
            setIsInWishlist(wishlistIds.includes(course._id));
        } catch (error) {
            // Ignore
        }
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setWishlistLoading(true);
        try {
            const { data } = await API.put(`/users/wishlist/${course._id}`);
            setIsInWishlist(data.inWishlist);
        } catch (error) {
            console.error(error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const getDifficultyColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-700';
            case 'intermediate': return 'bg-yellow-100 text-yellow-700';
            case 'advanced': return 'bg-red-100 text-red-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <Link to={`/courses/${course._id}`} className="group block h-full">
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 h-full flex flex-col"
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={resolveCourseThumbnail(course)}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => applyThumbnailFallback(e, course)}
                    />
                    
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {course.category}
                        </span>
                    </div>
                    
                    {(course.difficulty || course.level) && (
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty || course.level)}`}>
                                {course.difficulty || course.level}
                            </span>
                        </div>
                    )}
                    
                    <button
                        onClick={toggleWishlist}
                        disabled={wishlistLoading}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg z-10 ${
                            isInWishlist 
                                ? 'bg-pink-500 text-white' 
                                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-pink-500'
                        } ${course.difficulty ? 'top-14' : ''}`}
                    >
                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                        >
                            <Play className="w-6 h-6 text-primary-500 fill-current" />
                        </motion.div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-6 flex-1 flex flex-direction-column">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {course.description || "Master the skills you need to advance your career with hands-on projects and expert guidance."}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium text-gray-700">{course.rating || '4.8'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.studentsEnrolled || '1.2k'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration || '12h'}</span>
                        </div>
                    </div>

                    {/* Instructor */}
                    {course.instructor && (
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src={course.instructor.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                                alt={course.instructor.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                                <div className="text-sm font-medium text-gray-900">{course.instructor.name}</div>
                                <div className="text-xs text-gray-500">{course.instructor.title || 'Expert Instructor'}</div>
                            </div>
                        </div>
                    )}

                    {/* Price and CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                            {course.originalPrice && course.originalPrice > course.price && (
                                <span className="text-sm text-gray-500 line-through">₹{course.originalPrice}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CourseCard;
