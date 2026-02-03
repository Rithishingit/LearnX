import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, enrollCourse, checkEnrollment } from '../services/api';
import { motion } from 'framer-motion';
import { 
    PlayCircle, Clock, Users, Star, CheckCircle, Lock, Loader2, 
    ChevronRight, Award, Zap, Play, BookOpen, Globe, 
    FileText, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import CourseReviews from '../components/CourseReviews';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const CourseDetail = ({ user }) => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentData, setEnrollmentData] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await getCourse(id);
                setCourse(data.data);
                
                if (user) {
                    try {
                        const { data: enrollData } = await checkEnrollment(id);
                        if (enrollData.enrolled) {
                            setIsEnrolled(true);
                            setEnrollmentData(enrollData.data);
                        }
                    } catch (e) {}
                }
            } catch (error) {
                toast.error('Course not found');
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate, user]);

    const handleEnroll = async () => {
        if (!user) {
            toast.info('Please sign in to enroll in this course');
            sessionStorage.setItem('redirectAfterLogin', `/courses/${id}`);
            navigate('/login');
            return;
        }

        if (isEnrolled) {
            navigate(`/learn/${id}`);
            return;
        }

        setEnrolling(true);
        try {
            if (course.price === 0) {
                const { data } = await enrollCourse(id);
                if (data.success) {
                    toast.success('🎉 Successfully enrolled! Start learning now.');
                    navigate(`/learn/${id}`);
                } else {
                    toast.error(data.message || 'Enrollment failed');
                }
            } else {
                toast.info('Payment integration coming soon!');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Enrollment failed. Try again.';
            if (message.includes('Already enrolled')) {
                toast.success('You\'re already enrolled! Redirecting...');
                navigate(`/learn/${id}`);
            } else {
                toast.error(message);
            }
        } finally {
            setEnrolling(false);
        }
    };

    const getTotalLessons = () => {
        return course?.sections?.reduce((acc, section) => acc + (section.content?.length || 0), 0) || 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                        <Link to="/courses" className="hover:text-white transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Courses
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-300">{course.category}</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-4">
                                    {course.category}
                                </span>
                                
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                    {course.title}
                                </h1>
                                
                                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
                                    {course.description}
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                                                />
                                            ))}
                                        </div>
                                        <span className="font-semibold">4.8</span>
                                        <span className="text-slate-400">(2,400 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Users className="w-5 h-5 text-indigo-400" />
                                        <span className="font-semibold">{course.studentsEnrolled || 0}</span>
                                        <span className="text-slate-400">students</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Clock className="w-5 h-5 text-indigo-400" />
                                        <span>{course.sections?.length || 0} sections</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {course.instructor?.name?.charAt(0) || 'I'}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Created by</p>
                                        <p className="font-semibold">{course.instructor?.name || 'Expert Instructor'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-24"
                            >
                                <div className="relative aspect-video">
                                    <img 
                                        src={resolveCourseThumbnail(course)}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => applyThumbnailFallback(e, course)}
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className="text-4xl font-bold text-gray-900">
                                            {course.price === 0 ? (
                                                <span className="text-emerald-600">FREE</span>
                                            ) : (
                                                <span>₹{course.price}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Full lifetime access</p>
                                    </div>

                                    {isEnrolled ? (
                                        <button
                                            onClick={() => navigate(`/learn/${id}`)}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            <Play className="w-5 h-5" fill="white" />
                                            {enrollmentData?.progress > 0 ? `Continue (${enrollmentData.progress}%)` : 'Start Learning'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleEnroll}
                                            disabled={enrolling}
                                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            {enrolling ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Enrolling...
                                                </>
                                            ) : (
                                                !user ? 'Sign in to Enroll' : (course.price === 0 ? 'Enroll for Free' : 'Enroll Now')
                                            )}
                                        </button>
                                    )}

                                    {/* Features */}
                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <BookOpen className="w-5 h-5 text-indigo-500" />
                                            <span>{getTotalLessons()} lessons</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Clock className="w-5 h-5 text-indigo-500" />
                                            <span>12+ hours of content</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Award className="w-5 h-5 text-indigo-500" />
                                            <span>Certificate on completion</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Globe className="w-5 h-5 text-indigo-500" />
                                            <span>Access on all devices</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* What You'll Learn */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Zap className="w-6 h-6 text-indigo-500" />
                                What you'll learn
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    `Master the fundamentals of ${course.category}`,
                                    "Build real-world projects from scratch",
                                    "Learn industry best practices",
                                    "Gain practical, job-ready skills",
                                    "Understand core concepts deeply",
                                    "Get hands-on coding experience"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Course Curriculum */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                            <p className="text-gray-600 mb-6">
                                {course.sections?.length || 0} sections • {getTotalLessons()} lessons
                            </p>
                            
                            <div className="space-y-3">
                                {course.sections?.map((section, idx) => (
                                    <div 
                                        key={idx} 
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-semibold text-sm">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-semibold text-gray-900">{section.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">
                                                    {section.content?.length || 0} lessons
                                                </span>
                                                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === idx ? 'rotate-90' : ''}`} />
                                            </div>
                                        </button>
                                        
                                        {activeSection === idx && section.content && (
                                            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                                                {section.content.map((lesson, lessonIdx) => (
                                                    <div 
                                                        key={lessonIdx}
                                                        className="flex items-center gap-3 py-3 text-gray-600"
                                                    >
                                                        {isEnrolled ? (
                                                            <PlayCircle className="w-5 h-5 text-indigo-500" />
                                                        ) : (
                                                            <Lock className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        <span>{lesson.title || `Lesson ${lessonIdx + 1}`}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Reviews Section */}
                        <CourseReviews 
                            courseId={id}
                            user={user}
                            isEnrolled={isEnrolled}
                            isInstructor={user?.id === course?.instructor?._id}
                        />
                    </div>

                    {/* Sidebar for Desktop - Requirements */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-lg mb-4">Requirements</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    Basic computer knowledge
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    Enthusiasm to learn
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    No prior experience needed
                                </li>
                            </ul>

                            <hr className="my-6" />

                            <h3 className="font-bold text-lg mb-4">This course includes</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    Downloadable resources
                                </li>
                                <li className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-indigo-500" />
                                    Certificate of completion
                                </li>
                                <li className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-indigo-500" />
                                    Lifetime access
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
