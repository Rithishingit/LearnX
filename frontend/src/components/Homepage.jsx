import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Play, Star, Users, CheckCircle, Clock, Award, TrendingUp,
  BookOpen, Globe, Zap, Shield, Target, Sparkles, ChevronRight,
  GraduationCap, Building2, Heart, Rocket, X, MapPin, Phone, Mail, 
  Send, Linkedin, Twitter, Github, FileText, Headphones, Briefcase
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import api from '../services/api';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const Homepage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Fetch featured courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        if (response.data.success) {
          // Don't just take the first 6 (seed order biases to Business courses).
          // Pick top courses by enrollment so we get variety (AWS/tech etc show up).
          const sorted = [...(response.data.data || [])].sort(
            (a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0)
          );
          setCourses(sorted.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Stats data - universal metrics
  const stats = [
    { value: '50K+', label: 'Active Learners', icon: Users },
    { value: '500+', label: 'Expert Courses', icon: BookOpen },
    { value: '100+', label: 'Countries', icon: Globe },
    { value: '94%', label: 'Success Rate', icon: TrendingUp },
  ];

  // Universal features that work for any LMS
  const features = [
    {
      icon: Target,
      title: 'Goal-Oriented Learning',
      description: 'Structured paths designed to take you from beginner to expert in any field.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      description: 'Earn industry-recognized credentials that boost your career prospects.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Zap,
      title: 'Learn at Your Pace',
      description: 'Flexible scheduling that adapts to your life, not the other way around.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Shield,
      title: 'Expert Instructors',
      description: 'Learn from industry leaders with real-world experience and proven track records.',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  // Universal categories - works for any industry
  const categories = [
    { name: 'Business & Management', icon: '📊', count: 120 },
    { name: 'Technology & IT', icon: '💻', count: 85 },
    { name: 'Creative & Design', icon: '🎨', count: 64 },
    { name: 'Health & Wellness', icon: '🏥', count: 48 },
    { name: 'Personal Development', icon: '🌱', count: 92 },
    { name: 'Science & Research', icon: '🔬', count: 56 },
  ];

  // Testimonials - universal
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'Global Corp',
      image: 'SJ',
      quote: 'This platform transformed how our team learns. The quality of content is unmatched.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Career Switcher',
      company: 'Tech Startup',
      image: 'MC',
      quote: 'I went from complete beginner to landing my dream job in just 6 months.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'HR Manager',
      company: 'Enterprise Inc',
      image: 'ER',
      quote: 'We use this for all our corporate training. The ROI has been incredible.',
      rating: 5,
    },
  ];

  // Footer data
  const footerLinks = {
    learning: [
      { name: 'Browse Courses', href: '/courses', type: 'link' },
      { name: 'Learning Paths', href: '/courses?filter=paths', type: 'link' },
      { name: 'Certificates', href: '/courses?filter=certified', type: 'link' },
      { name: 'Free Courses', href: '/courses?filter=free', type: 'link' },
    ],
    company: [
      { name: 'About Us', type: 'modal', modal: 'about' },
      { name: 'Careers', type: 'modal', modal: 'careers' },
      { name: 'Contact', type: 'modal', modal: 'contact' },
      { name: 'Blog', type: 'modal', modal: 'blog' },
    ],
    support: [
      { name: 'Help Center', type: 'modal', modal: 'help' },
      { name: 'Terms of Service', type: 'modal', modal: 'terms' },
      { name: 'Privacy Policy', type: 'modal', modal: 'privacy' },
      { name: 'Accessibility', type: 'modal', modal: 'accessibility' },
    ],
  };

  // Modal content
  const modalContent = {
    about: {
      title: 'About Us',
      icon: Rocket,
      content: (
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            We're on a mission to make quality education accessible to everyone, everywhere. 
            Our platform connects passionate learners with world-class instructors, 
            creating transformative learning experiences that open doors to new opportunities.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    careers: {
      title: 'Join Our Team',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">We're always looking for passionate people to join us.</p>
          {['Product Designer', 'Full Stack Developer', 'Content Strategist', 'Customer Success'].map((role, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 flex justify-between items-center hover:bg-white/10 transition cursor-pointer">
              <div>
                <div className="text-white font-medium">{role}</div>
                <div className="text-sm text-gray-400">Remote • Full-time</div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </div>
          ))}
        </div>
      ),
    },
    contact: {
      title: 'Get in Touch',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
            <Mail className="text-violet-400" size={24} />
            <div>
              <div className="text-sm text-gray-400">Email</div>
              <div className="text-white">hello@learnx.com</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
            <Phone className="text-emerald-400" size={24} />
            <div>
              <div className="text-sm text-gray-400">Phone</div>
              <div className="text-white">+1 (555) 123-4567</div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
            <MapPin className="text-amber-400" size={24} />
            <div>
              <div className="text-sm text-gray-400">Address</div>
              <div className="text-white">123 Learning Street, Education City</div>
            </div>
          </div>
        </div>
      ),
    },
    blog: {
      title: 'Latest from Blog',
      icon: FileText,
      content: (
        <div className="space-y-4">
          {[
            { title: 'The Future of Online Learning', date: 'Jan 28, 2026' },
            { title: '10 Skills Every Professional Needs', date: 'Jan 25, 2026' },
            { title: 'How to Stay Motivated While Learning', date: 'Jan 20, 2026' },
          ].map((post, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition cursor-pointer">
              <div className="text-white font-medium">{post.title}</div>
              <div className="text-sm text-gray-400 mt-1">{post.date}</div>
            </div>
          ))}
        </div>
      ),
    },
    help: {
      title: 'Help Center',
      icon: Headphones,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">Find answers to common questions or reach out to our support team.</p>
          <div className="grid grid-cols-2 gap-3">
            {['Getting Started', 'Account & Billing', 'Courses & Learning', 'Certificates'].map((topic, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition cursor-pointer">
                <div className="text-white text-sm">{topic}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      content: (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4">
          <p>By using our platform, you agree to these terms. We provide educational content and services as-is.</p>
          <p>Users are responsible for maintaining account security. Course access is granted upon purchase or subscription.</p>
          <p>Content may not be redistributed without permission. We reserve the right to update these terms.</p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      content: (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4">
          <p>We collect minimal data needed to provide our services. Your learning progress and account information are securely stored.</p>
          <p>We never sell your personal data. Analytics are used to improve the learning experience.</p>
          <p>You can request data deletion at any time by contacting our support team.</p>
        </div>
      ),
    },
    accessibility: {
      title: 'Accessibility',
      icon: Heart,
      content: (
        <div className="text-gray-300 text-sm leading-relaxed space-y-4">
          <p>We're committed to making learning accessible to everyone. Our platform follows WCAG 2.1 guidelines.</p>
          <p>Features include keyboard navigation, screen reader support, adjustable text sizes, and high contrast modes.</p>
          <p>If you encounter any accessibility issues, please contact us.</p>
        </div>
      ),
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  // Section component with scroll animation
  const AnimatedSection = ({ children, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
      <motion.section
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div 
      className="overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(180deg, #020617 0%, #0f172a 50%, #020617 100%)',
        marginTop: '-80px',
        paddingTop: '80px'
      }}
    >
      
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Clean, Bold, Universal
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs - subtle */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[150px]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Learning, made simple.</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            >
              <span className="text-white">Learn</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400"> Without</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">Limits.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">Build Beyond Them.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed"
            >
              The world keeps changing. Your ability to learn should never have to catch up.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold text-lg flex items-center gap-3 shadow-lg shadow-violet-500/25"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white font-semibold text-lg flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Free</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              variants={itemVariants}
              className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 mb-3">
                    <stat.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-1.5 bg-white/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES SECTION - Why Choose Us
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-violet-400 text-sm font-semibold tracking-wider uppercase"
            >
              Why Choose Us
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Succeed</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}
                className="group relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
                
                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-5`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          CATEGORIES SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase">Explore Topics</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Anything</span> You Want
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From business to technology, creativity to science—find courses that match your goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/courses')}
                className="group cursor-pointer p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500">{cat.count}+ courses</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURED COURSES SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">Featured Courses</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
                Start Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Today</span>
              </h2>
            </div>
            <Link to="/courses" className="mt-6 md:mt-0 group flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors">
              <span>View all courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="group cursor-pointer rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/5 hover:border-white/20 overflow-hidden transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={resolveCourseThumbnail(course)}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => applyThumbnailFallback(e, course)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                        {course.category || 'General'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration || '5h'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{course.rating || '4.5'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsEnrolled || 0} enrolled</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 px-6 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Learners</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/5"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 p-[1px]"
          >
            <div className="relative rounded-3xl bg-slate-950/90 backdrop-blur-xl p-12 md:p-16 text-center">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-cyan-600/20 blur-3xl" />
              
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-8"
                >
                  <GraduationCap className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Ready to Start Your Journey?
                </h2>
                
                <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
                  Join thousands of learners who are already transforming their careers. 
                  Your first course is on us.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg flex items-center gap-2"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link to="/courses">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold text-lg"
                    >
                      Browse Courses
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <BrandLogo size="lg" theme="dark" />
              <p className="text-gray-400 mt-4 max-w-sm leading-relaxed">
                Empowering learners worldwide with quality education. 
                Your success is our mission.
              </p>
              <div className="flex gap-4 mt-6">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-white font-semibold mb-4">Learning</h4>
              <ul className="space-y-3">
                {footerLinks.learning.map((link, i) => (
                  <li key={i}>
                    <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => setActiveModal(link.modal)}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => setActiveModal(link.modal)}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LearnX. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => setActiveModal('accessibility')} className="hover:text-white transition-colors">Accessibility</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL SYSTEM
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeModal && modalContent[activeModal] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  {modalContent[activeModal].icon && (() => {
                    const IconComponent = modalContent[activeModal].icon;
                    return (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <h3 className="text-xl font-semibold text-white">{modalContent[activeModal].title}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {modalContent[activeModal].content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
