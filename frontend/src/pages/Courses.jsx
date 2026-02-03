import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../services/api';
import { toast } from 'react-toastify';
import { Search, Filter, Star, Users, ArrowRight, Zap, Sparkles, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showBottomPopup, setShowBottomPopup] = useState(false);
    const [popupDismissed, setPopupDismissed] = useState(false);
    const bottomRef = useRef(null);

    // Detect when user scrolls to bottom
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !popupDismissed && courses.length > 0) {
                    setShowBottomPopup(true);
                }
            },
            { threshold: 0.1 }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }

        return () => observer.disconnect();
    }, [popupDismissed, courses.length]);

    const dismissPopup = () => {
        setShowBottomPopup(false);
        setPopupDismissed(true);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await getCourses();
                setCourses(data.data || []);
            } catch (error) {
                toast.error('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const categories = ['All', 'Development', 'Design', 'Business', 'Data Science'];

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative">
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
            />

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-indigo-200/50"
                        >
                            <Sparkles className="w-4 h-4" />
                            Explore our premium collection
                        </motion.div>

                        <h1 className="text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
                            What will you{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                                master
                            </span>
                            {' '}today?
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                            Discover expertly crafted courses designed to build real-world skills and accelerate your career in tech, design, and business.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center mt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full max-w-2xl"
                        >
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search courses, skills, or topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-xl border-2 border-white/50 rounded-2xl focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/20 text-gray-900 placeholder-gray-400 font-medium transition-all duration-300"
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-3 justify-center w-full lg:w-auto"
                        >
                            {categories.map((cat, idx) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveCategory(cat)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                        activeCategory === cat
                                            ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg hover:shadow-2xl'
                                            : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50 hover:border-indigo-300'
                                    }`}
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-12"
                    >
                        <p className="text-gray-600 font-medium text-lg">
                            <span className="text-indigo-600 font-bold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} available
                        </p>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-96">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                        />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                            >
                                <Link to={`/courses/${course._id}`}>
                                    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col hover:border-indigo-200">
                                        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {course.category || 'General'}
                                        </div>

                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-400 to-pink-400">
                                            <img
                                                src={resolveCourseThumbnail(course)}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => applyThumbnailFallback(e, course)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        </div>

                                        <div className="flex flex-col flex-1 p-6">
                                            <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 font-medium">by {course.instructor?.name || 'Expert Instructor'}</p>
                                            <p className="text-gray-600 mb-6 line-clamp-2 flex-1 text-sm leading-relaxed">
                                                {course.description}
                                            </p>

                                            <div className="flex gap-6 text-sm mb-6 pb-6 border-b border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < Math.floor(course.rating || 4.8)
                                                                        ? 'text-yellow-400 fill-yellow-400'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-bold text-gray-900">{course.rating || 4.8}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    <span>{course.studentsEnrolled || 0} students</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        ${course.price}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileHover={{ x: 5 }}
                                                    className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-2 rounded-full shadow-lg hover:shadow-2xl transition-all"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && filteredCourses.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-xl font-medium mb-2">No courses found</p>
                        <p className="text-gray-500">Try adjusting your search or explore different categories.</p>
                    </motion.div>
                )}

                <div ref={bottomRef} className="h-4" />
            </div>

            <AnimatePresence>
                {showBottomPopup && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">More Courses Coming Soon!</h4>
                                <p className="text-sm text-white/80">
                                    Our instructors are working on exciting new courses. Stay tuned for updates!
                                </p>
                            </div>
                            <button
                                onClick={dismissPopup}
                                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Courses;
