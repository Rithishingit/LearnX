import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCourses } from '../services/api';
import { toast } from 'react-toastify';
import { Search, X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBottomPopup, setShowBottomPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const bottomRef = useRef(null);

  const requestedCategory = searchParams.get('category') || 'All';
  const activeCategory = requestedCategory === 'All' ? 'All' : requestedCategory;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await getCourses();
        setCourses(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const values = new Set(
      courses
        .map((course) => String(course?.category || '').trim())
        .filter(Boolean)
    );
    return ['All', ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [courses]);

  useEffect(() => {
    if (!loading && activeCategory !== 'All' && !categories.includes(activeCategory)) {
      setSearchParams({}, { replace: true });
    }
  }, [activeCategory, categories, loading, setSearchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !popupDismissed && courses.length > 0) {
          setShowBottomPopup(true);
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [popupDismissed, courses.length]);

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      const title = String(course?.title || '').toLowerCase();
      const category = String(course?.category || '').toLowerCase();
      const description = String(course?.description || '').toLowerCase();
      const matchesSearch = !query || title.includes(query) || category.includes(query) || description.includes(query);
      const matchesCategory = activeCategory === 'All' || course?.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchTerm, activeCategory]);

  const selectCategory = (category) => {
    if (category === 'All') {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ category }, { replace: false });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden relative">
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-indigo-200/50">
              <Sparkles className="w-4 h-4" /> Explore the catalogue
            </motion.div>
            <h1 className="text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight">
              What will you{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">master</span>
              {' '}today?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Explore the current LearnX catalogue. Search by course, skill, topic, or learning domain.
            </p>
          </div>

          <div className="flex flex-col gap-6 items-center justify-center mt-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative w-full max-w-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, skills, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-xl border-2 border-white/50 rounded-2xl focus:outline-none focus:border-indigo-500 focus:shadow-lg focus:shadow-indigo-500/20 text-gray-900 placeholder-gray-400 font-medium transition-all duration-300"
              />
            </motion.div>

            <div className="flex flex-wrap gap-3 justify-center w-full">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectCategory(category)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.04 }}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-white/50 hover:border-indigo-300'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 flex items-center justify-between gap-4">
            <p className="text-gray-600 font-medium text-lg">
              <span className="text-indigo-600 font-bold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} available
              {activeCategory !== 'All' && <span className="text-gray-400"> in {activeCategory}</span>}
            </p>
            {activeCategory !== 'All' && (
              <button type="button" onClick={() => selectCategory('All')} className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
                Clear domain <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="animate-pulse rounded-2xl bg-white h-80 border border-gray-100" />)}
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <motion.div key={course._id} variants={itemVariants} whileHover={{ y: -8 }}>
                <Link to={`/courses/${course._id}`}>
                  <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col hover:border-indigo-200">
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {course.category || 'General'}
                    </div>
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-400 to-pink-400">
                      <img src={resolveCourseThumbnail(course)} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => applyThumbnailFallback(e, course)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 font-medium">by {course.instructor?.name || 'Instructor'}</p>
                      <p className="text-gray-600 mb-6 line-clamp-2 flex-1 text-sm leading-relaxed">{course.description}</p>
                      <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{course.price === 0 ? 'Free' : `₹${course.price}`}</p>
                          <p className="text-xs text-gray-400 mt-1">{course.duration || 'Self-paced'}</p>
                        </div>
                        <motion.span whileHover={{ x: 5 }} className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-2 rounded-full shadow-lg">
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-medium mb-2">No courses found</p>
            <p className="text-gray-500">Try another search or choose a different learning domain.</p>
          </motion.div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      <AnimatePresence>
        {showBottomPopup && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/30 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0"><BookOpen className="w-6 h-6 text-white" /></div>
              <div className="flex-1"><h4 className="font-semibold text-white mb-1">The catalogue will keep growing.</h4><p className="text-sm text-white/80">New courses can be added without changing the discovery interface.</p></div>
              <button type="button" onClick={() => { setShowBottomPopup(false); setPopupDismissed(true); }} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"><X className="w-4 h-4 text-white" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;
