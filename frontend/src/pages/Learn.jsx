import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PlayCircle, CheckCircle, ChevronLeft, ChevronRight, 
    BookOpen, MessageSquare, FileText, Clock, Sparkles,
    Download, Bookmark, Volume2, Maximize, Target, Award,
    Lightbulb, Code, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-toastify';
import AnimatedLesson from '../components/AnimatedLesson';

const Learn = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('content');
    const [progress, setProgress] = useState(0);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await API.get(`/courses/${id}`);
                setCourse(data.data);
                if (data.data.sections && data.data.sections.length > 0 && data.data.sections[0].content.length > 0) {
                    setActiveLesson(data.data.sections[0].content[0]);
                    setActiveSectionIndex(0);
                    setActiveLessonIndex(0);
                }
                
                // Fetch enrollment data to get saved progress
                try {
                    const { data: enrollData } = await API.get(`/enrollments/${id}`);
                    if (enrollData.enrolled && enrollData.data) {
                        const savedProgress = enrollData.data.completedLessons || [];
                        setCompletedLessons(new Set(savedProgress));
                        setProgress(enrollData.data.progress || 0);
                    }
                } catch (e) {
                    // Not enrolled or error - that's okay
                }
            } catch (error) {
                toast.error('Failed to load course');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (course && course.sections) {
            const totalLessons = course.sections.reduce((acc, section) => acc + section.content.length, 0);
            const completedCount = completedLessons.size;
            const newProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            setProgress(newProgress);
        }
    }, [completedLessons, course]);

    // Save progress to backend whenever completedLessons changes
    useEffect(() => {
        const saveProgress = async () => {
            if (!course || completedLessons.size === 0) return;
            
            const totalLessons = course.sections.reduce((acc, section) => acc + section.content.length, 0);
            const newProgress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
            
            try {
                await API.put(`/enrollments/${id}/progress`, {
                    progress: newProgress,
                    completedLessons: Array.from(completedLessons)
                });
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        };
        
        // Debounce the save to avoid too many API calls
        const timeoutId = setTimeout(saveProgress, 1000);
        return () => clearTimeout(timeoutId);
    }, [completedLessons, course, id]);

    const markLessonComplete = () => {
        if (!activeLesson) return;
        const lessonId = activeLesson._id || activeLesson.title;
        
        // Check if already completed
        if (completedLessons.has(lessonId)) {
            goToNextLesson();
            return;
        }
        
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        toast.success('🎉 Lesson completed!', {
            position: 'top-center',
            autoClose: 2000,
        });
    };

    const navigateToLesson = (sectionIdx, lessonIdx) => {
        if (course?.sections?.[sectionIdx]?.content?.[lessonIdx]) {
            setActiveSectionIndex(sectionIdx);
            setActiveLessonIndex(lessonIdx);
            setActiveLesson(course.sections[sectionIdx].content[lessonIdx]);
            setActiveTab('content');
        }
    };

    const goToNextLesson = () => {
        if (!course) return;
        
        const currentSection = course.sections[activeSectionIndex];
        if (activeLessonIndex < currentSection.content.length - 1) {
            navigateToLesson(activeSectionIndex, activeLessonIndex + 1);
        } else if (activeSectionIndex < course.sections.length - 1) {
            navigateToLesson(activeSectionIndex + 1, 0);
        }
    };

    const goToPrevLesson = () => {
        if (!course) return;
        
        if (activeLessonIndex > 0) {
            navigateToLesson(activeSectionIndex, activeLessonIndex - 1);
        } else if (activeSectionIndex > 0) {
            const prevSection = course.sections[activeSectionIndex - 1];
            navigateToLesson(activeSectionIndex - 1, prevSection.content.length - 1);
        }
    };

    const hasNextLesson = () => {
        if (!course) return false;
        const currentSection = course.sections[activeSectionIndex];
        return activeLessonIndex < currentSection.content.length - 1 || activeSectionIndex < course.sections.length - 1;
    };

    const hasPrevLesson = () => {
        return activeLessonIndex > 0 || activeSectionIndex > 0;
    };

    const handleQuizSubmit = () => {
        setQuizSubmitted(true);
        const correctCount = course.quizzes?.reduce((acc, quiz, idx) => {
            return acc + (quizAnswers[idx] === quiz.correct ? 1 : 0);
        }, 0) || 0;
        const total = course.quizzes?.length || 0;
        const score = Math.round((correctCount / total) * 100);
        
        if (score >= 70) {
            toast.success(`🎉 Passed! Score: ${score}%`);
        } else {
            toast.error(`Score: ${score}%. Need 70% to pass.`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-400">Loading your learning experience...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
                    <p className="text-gray-400 mb-6">This course may have been removed or doesn't exist.</p>
                    <Link to="/courses" className="bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-xl font-medium transition-colors">
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    // Check if course has sections with content
    if (!course.sections || course.sections.length === 0 || !course.sections[0].content || course.sections[0].content.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center text-white">
                <div className="text-center max-w-md mx-auto p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Sparkles className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">{course.title}</h2>
                    <p className="text-gray-400 mb-6">
                        {course.description}
                    </p>
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 text-left mb-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-400" />
                            Course Content Coming Soon
                        </h3>
                        <p className="text-gray-400 text-sm">
                            The instructor is preparing amazing content for this course. 
                            Check back soon or explore other courses!
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Link 
                            to="/dashboard" 
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <Link 
                            to="/courses" 
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-xl font-medium transition-colors"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
            {/* Header */}
            <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/dashboard" 
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-semibold text-white truncate max-w-md flex items-center gap-2">
                            {course.title}
                            {course.aiGenerated && (
                                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-gray-400">{activeLesson?.title}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-40 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-300">{progress}%</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowNotes(!showNotes)}
                            className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-primary-600' : 'hover:bg-gray-700'}`}
                            title="Notes"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                        {course.quizzes && course.quizzes.length > 0 && (
                            <button 
                                onClick={() => setShowQuiz(!showQuiz)}
                                className={`p-2 rounded-lg transition-colors ${showQuiz ? 'bg-primary-600' : 'hover:bg-gray-700'}`}
                                title="Quiz"
                            >
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-gray-800/50 border-b border-gray-700/50 px-6">
                        <div className="flex gap-1">
                            {['content', 'keyPoints', 'examples'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                                        activeTab === tab 
                                            ? 'border-primary-500 text-white' 
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab === 'keyPoints' ? 'Key Points' : tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'content' && activeLesson && (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-8 max-w-4xl mx-auto"
                                >
                                    {activeLesson.script ? (
                                        <AnimatedLesson lesson={activeLesson} />
                                    ) : (
                                        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                                            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                                                {activeLesson.title}
                                            </h2>
                                            <div className="prose prose-invert prose-lg max-w-none">
                                                <p className="text-gray-300 leading-relaxed">
                                                    Welcome to <strong>{activeLesson.title}</strong>! This lesson covers fundamental concepts that will help you build a strong foundation.
                                                </p>
                                                <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                                                    <p className="text-primary-300 flex items-center gap-2">
                                                        <Sparkles className="w-5 h-5" />
                                                        This course is ready for learning. Click "Complete & Continue" to progress!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'keyPoints' && (
                                <motion.div
                                    key="keyPoints"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-8 max-w-4xl mx-auto"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <Lightbulb className="w-7 h-7 text-yellow-500" />
                                        Key Points to Remember
                                    </h2>
                                    {activeLesson?.keyPoints && activeLesson.keyPoints.length > 0 ? (
                                        <div className="space-y-4">
                                            {activeLesson.keyPoints.map((point, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-start gap-4 bg-gray-800/50 rounded-xl p-5 border border-gray-700/50"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-gray-300 text-lg">{point}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
                                            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                            <p className="text-gray-500">Key points will appear here as you progress through the lesson</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'examples' && (
                                <motion.div
                                    key="examples"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-8 max-w-4xl mx-auto"
                                >
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <Code className="w-7 h-7 text-cyan-500" />
                                        Real-World Examples
                                    </h2>
                                    {activeLesson?.examples && activeLesson.examples.length > 0 ? (
                                        <div className="space-y-4">
                                            {activeLesson.examples.map((example, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-gray-800/50 rounded-xl p-5 border border-cyan-500/30"
                                                >
                                                    <p className="text-gray-300">{example}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-800/30 rounded-2xl">
                                            <Code className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                            <p className="text-gray-500">Examples will be shown here to reinforce your learning</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Lesson Controls */}
                    <div className="bg-gray-800/80 backdrop-blur-lg border-t border-gray-700/50 p-4">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                            <button 
                                onClick={goToPrevLesson}
                                disabled={!hasPrevLesson()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>
                            
                            <button 
                                onClick={() => {
                                    markLessonComplete();
                                    if (hasNextLesson()) {
                                        setTimeout(goToNextLesson, 500);
                                    }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl transition-all shadow-lg shadow-green-500/20"
                            >
                                <CheckCircle className="w-5 h-5" />
                                <span>Complete & Continue</span>
                            </button>
                            
                            <button 
                                onClick={goToNextLesson}
                                disabled={!hasNextLesson()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Notes Panel */}
                <AnimatePresence>
                    {showNotes && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 350, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-gray-800 border-l border-gray-700 flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary-500" />
                                    My Notes
                                </h3>
                                <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-white">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 p-4">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Take notes while you learn..."
                                    className="w-full h-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quiz Panel */}
                <AnimatePresence>
                    {showQuiz && course.quizzes && course.quizzes.length > 0 && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 450, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Course Quiz
                                </h3>
                                <button onClick={() => setShowQuiz(false)} className="text-gray-400 hover:text-white">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {course.quizzes.map((quiz, qIdx) => (
                                    <div key={qIdx} className="bg-gray-900/50 rounded-xl p-5 border border-gray-700">
                                        <p className="font-medium text-white mb-4">
                                            {qIdx + 1}. {quiz.question}
                                        </p>
                                        <div className="space-y-2">
                                            {quiz.options.map((option, oIdx) => {
                                                const isSelected = quizAnswers[qIdx] === oIdx;
                                                const isCorrect = quiz.correct === oIdx;
                                                const showResult = quizSubmitted;
                                                
                                                return (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => !quizSubmitted && setQuizAnswers({...quizAnswers, [qIdx]: oIdx})}
                                                        disabled={quizSubmitted}
                                                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                                                            showResult && isCorrect
                                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                                : showResult && isSelected && !isCorrect
                                                                    ? 'bg-red-500/20 border-red-500 text-red-400'
                                                                    : isSelected
                                                                        ? 'bg-primary-500/20 border-primary-500 text-white'
                                                                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </span>
                                                            <span>{option}</span>
                                                            {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 ml-auto text-green-500" />}
                                                            {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto text-red-500" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {quizSubmitted && quiz.explanation && (
                                            <p className="mt-4 text-sm text-gray-400 bg-gray-800 rounded-lg p-3">
                                                💡 {quiz.explanation}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                
                                {!quizSubmitted && (
                                    <button
                                        onClick={handleQuizSubmit}
                                        disabled={Object.keys(quizAnswers).length !== course.quizzes.length}
                                        className="w-full py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-all"
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar - Course Curriculum */}
                <motion.aside
                    initial={false}
                    animate={{ width: sidebarOpen ? 380 : 0 }}
                    className="bg-gray-800/50 backdrop-blur-lg border-l border-gray-700/50 flex flex-col overflow-hidden"
                >
                    <div className="p-4 border-b border-gray-700/50">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary-500" />
                            Course Content
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {course.sections?.length || 0} sections • {course.sections?.reduce((acc, s) => acc + s.content.length, 0) || 0} lessons
                        </p>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {course.sections?.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    {section.title}
                                </h4>
                                <div className="space-y-1">
                                    {section.content.map((lesson, lessonIndex) => {
                                        const isActive = activeSectionIndex === sectionIndex && activeLessonIndex === lessonIndex;
                                        const lessonId = lesson._id || lesson.title;
                                        const isCompleted = completedLessons.has(lessonId);
                                        
                                        return (
                                            <motion.button
                                                key={lessonIndex}
                                                onClick={() => navigateToLesson(sectionIndex, lessonIndex)}
                                                whileHover={{ x: 4 }}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                                                    isActive 
                                                        ? 'bg-gradient-to-r from-primary-600/20 to-secondary-600/20 text-white border border-primary-500/30' 
                                                        : 'hover:bg-gray-700/50 text-gray-300'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                ) : isActive ? (
                                                    <PlayCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                                ) : (
                                                    <PlayCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-sm">{lesson.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {lesson.duration || '10:00'}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Learning Outcomes */}
                        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                            <div className="mt-6 p-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-xl border border-primary-500/20">
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary-400" />
                                    What You'll Learn
                                </h4>
                                <ul className="space-y-2">
                                    {course.learningOutcomes.map((outcome, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            {outcome}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </motion.aside>

                {/* Sidebar Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-l-lg p-2 text-white transition-colors"
                    style={{ right: sidebarOpen ? '380px' : '0' }}
                >
                    {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

export default Learn;
