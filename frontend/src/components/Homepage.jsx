import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight, Play, Clock, Award, Zap, Shield, Target, Sparkles,
  ChevronRight, GraduationCap, Heart, Rocket, X, MapPin, Phone, Mail,
  Linkedin, Twitter, Github, FileText, Headphones, Briefcase
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import api from '../services/api';
import { resolveCourseThumbnail, applyThumbnailFallback } from '../utils/courseMedia';

const DOMAIN_PALETTE = [
  { accent: '#8b5cf6', soft: 'rgba(139,92,246,0.18)' },
  { accent: '#06b6d4', soft: 'rgba(6,182,212,0.18)' },
  { accent: '#10b981', soft: 'rgba(16,185,129,0.18)' },
  { accent: '#f59e0b', soft: 'rgba(245,158,11,0.18)' },
  { accent: '#f43f5e', soft: 'rgba(244,63,94,0.18)' },
  { accent: '#3b82f6', soft: 'rgba(59,130,246,0.18)' },
];

const DOMAIN_ICONS = {
  'Business & Management': '◈',
  'Technology & IT': '⌘',
  'Creative & Design': '✦',
  'Health & Wellness': '＋',
  'Personal Development': '↗',
  'Science & Research': '∿',
};

const PROCESS = [
  {
    number: '01',
    title: 'LEARN',
    description: 'Build the foundation that everything else stands on.',
    icon: Target,
  },
  {
    number: '02',
    title: 'PRACTICE',
    description: 'Turn understanding into real capability through deliberate work.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'BUILD',
    description: 'Create, experiment, and solve problems that make the knowledge useful.',
    icon: Award,
  },
  {
    number: '04',
    title: 'EVOLVE',
    description: 'Reflect, improve, and move naturally into harder challenges.',
    icon: Shield,
  },
];

const Homepage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExploreIndex, setActiveExploreIndex] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        if (response.data.success) {
          setCourses(Array.isArray(response.data.data) ? response.data.data : []);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const domains = useMemo(() => {
    const grouped = new Map();
    courses.forEach((course) => {
      const name = String(course?.category || 'General').trim() || 'General';
      if (!grouped.has(name)) grouped.set(name, []);
      grouped.get(name).push(course);
    });

    return Array.from(grouped.entries())
      .map(([name, domainCourses], index) => ({
        name,
        courses: domainCourses,
        count: domainCourses.length,
        index,
        icon: DOMAIN_ICONS[name] || '•',
        palette: DOMAIN_PALETTE[index % DOMAIN_PALETTE.length],
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [courses]);

  const featuredCourses = useMemo(() => {
    if (!courses.length) return [];
    const picked = [];
    const seen = new Set();
    for (const domain of domains) {
      const course = domain.courses[0];
      if (course && !seen.has(course._id)) {
        picked.push(course);
        seen.add(course._id);
      }
      if (picked.length === 6) break;
    }
    if (picked.length < 6) {
      courses.forEach((course) => {
        if (picked.length < 6 && !seen.has(course._id)) {
          picked.push(course);
          seen.add(course._id);
        }
      });
    }
    return picked;
  }, [courses, domains]);

  const exploreItems = useMemo(() => ([
    {
      name: 'All Courses',
      count: courses.length,
      icon: '↗',
      palette: { accent: '#ffffff', soft: 'rgba(255,255,255,0.12)' },
      courses,
      isAll: true,
    },
    ...domains.map((domain) => ({ ...domain, isAll: false })),
  ]), [courses, domains]);

  const activeExploreItem = exploreItems[activeExploreIndex] || exploreItems[0] || null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  const AnimatedSection = ({ children, className = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    return (
      <motion.section
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    );
  };

  const changeExplore = (direction) => {
    if (!exploreItems.length) return;
    setActiveExploreIndex((current) => (current + direction + exploreItems.length) % exploreItems.length);
  };

  const selectExploreItem = (index) => {
    if (!exploreItems.length) return;
    setActiveExploreIndex((index + exploreItems.length) % exploreItems.length);
  };

  const goToDomain = (name) => {
    navigate(`/courses?category=${encodeURIComponent(name)}`);
  };

  // Footer data intentionally preserved for a later homepage traversal pass.
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

  const modalContent = {
    about: {
      title: 'About Us', icon: Rocket,
      content: <p className="text-gray-300 leading-relaxed">LearnX is being built as a learning platform where people, educators, organizations and technology can meet around useful learning experiences. This product will evolve as the platform grows.</p>,
    },
    careers: {
      title: 'Join Our Team', icon: Briefcase,
      content: <div className="space-y-4"><p className="text-gray-300">Opportunities will appear here as LearnX begins building its wider team.</p></div>,
    },
    contact: {
      title: 'Get in Touch', icon: Mail,
      content: <div className="space-y-4"><div className="bg-white/5 rounded-xl p-4 flex items-center gap-4"><Mail className="text-violet-400" size={24} /><div><div className="text-sm text-gray-400">Email</div><div className="text-white">hello@learnx.com</div></div></div></div>,
    },
    blog: {
      title: 'Latest from Blog', icon: FileText,
      content: <p className="text-gray-300">The LearnX publication space will appear here.</p>,
    },
    help: {
      title: 'Help Center', icon: Headphones,
      content: <p className="text-gray-300">Help and support resources will be built as the platform grows.</p>,
    },
    terms: {
      title: 'Terms of Service', icon: FileText,
      content: <div className="text-gray-300 text-sm leading-relaxed space-y-4"><p>These terms will be replaced with the formal LearnX terms before public release.</p></div>,
    },
    privacy: {
      title: 'Privacy Policy', icon: Shield,
      content: <div className="text-gray-300 text-sm leading-relaxed space-y-4"><p>The final privacy policy will be published before public release.</p></div>,
    },
    accessibility: {
      title: 'Accessibility', icon: Heart,
      content: <div className="text-gray-300 text-sm leading-relaxed space-y-4"><p>Accessibility will remain a product requirement as LearnX evolves.</p></div>,
    },
  };

  return (
    <div
      className="overflow-hidden relative bg-[#05070b] text-white"
      style={{ marginTop: '-80px', paddingTop: '80px' }}
    >
      <motion.div
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 h-px bg-white/70 z-[70]"
      />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-violet-500/[0.07] blur-[140px]" />
          <div className="absolute right-[-15%] bottom-[-20%] w-[500px] h-[500px] rounded-full bg-cyan-400/[0.05] blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
              <Sparkles className="w-3.5 h-3.5" /> Learning, made simple.
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[7.5rem] leading-[0.9] font-semibold tracking-[-0.06em]">
            Learn <span className="text-white/35">without</span><br />
            limits.<br />
            <span className="text-white/35">Build beyond them.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-10 text-base md:text-lg text-white/48 leading-relaxed">
            One place to discover knowledge, practice skills, create real work, and keep moving into whatever comes next.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/courses" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
              Explore the learning space <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/12 bg-white/[0.03] text-white/80 hover:bg-white/[0.07] transition-colors">
              <Play className="w-4 h-4" /> Start free
            </Link>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/25">Explore below</div>
      </section>

      {/* LEARNING EXPLORER */}
      <AnimatedSection className="px-6 py-28 md:py-36">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4">Explore the learning space</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.05em]">Start anywhere.<br /><span className="text-white/35">Go as deep as you want.</span></h2>
            <p className="mt-6 max-w-2xl text-white/45 leading-relaxed">A catalogue that grows with what you want to learn.</p>
          </div>

          <div
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.018] min-h-[610px] md:min-h-[650px]"
            style={{ perspective: '1400px', '--card-shift': 'clamp(145px, 23vw, 270px)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(139,92,246,.10),transparent_35%)] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            <div className="absolute top-7 left-1/2 -translate-x-1/2 z-40 text-center">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/25">Learning catalogue</div>
              <div className="mt-2 text-xs text-white/35">{exploreItems.length ? `${activeExploreIndex + 1} / ${exploreItems.length}` : '0 / 0'}</div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pt-8">
              {exploreItems.length === 0 ? (
                <div className="text-center text-white/35">Courses will appear here as the catalogue grows.</div>
              ) : (
                [-2, -1, 0, 1, 2].map((offset) => {
                  const index = (activeExploreIndex + offset + exploreItems.length) % exploreItems.length;
                  const item = exploreItems[index];
                  const isActive = offset === 0;
                  const abs = Math.abs(offset);
                  const x = offset === 0 ? 0 : offset < 0 ? `calc(${offset} * var(--card-shift))` : `calc(${offset} * var(--card-shift))`;
                  const accent = item.palette?.accent || '#8b5cf6';
                  return (
                    <motion.button
                      key={`${item.name}-${index}`}
                      type="button"
                      drag={isActive ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.18}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 500) {
                          changeExplore(info.offset.x < 0 ? 1 : -1);
                        }
                      }}
                      onClick={() => selectExploreItem(index)}
                      animate={{
                        x,
                        scale: isActive ? 1 : abs === 1 ? 0.82 : 0.68,
                        rotateY: isActive ? 0 : offset < 0 ? 18 : -18,
                        opacity: isActive ? 1 : abs === 1 ? 0.62 : 0.25,
                        filter: isActive ? 'blur(0px)' : abs === 1 ? 'blur(0.5px)' : 'blur(1.5px)',
                      }}
                      transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                      className={`absolute left-1/2 -translate-x-1/2 w-[min(78vw,520px)] h-[350px] md:h-[390px] rounded-[2rem] text-left border bg-[#080b11]/95 backdrop-blur-xl overflow-hidden ${isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                      style={{
                        zIndex: 30 - abs,
                        borderColor: isActive ? `${accent}80` : 'rgba(255,255,255,.08)',
                        boxShadow: isActive ? `0 30px 100px ${item.palette?.soft || 'rgba(139,92,246,.15)'}` : '0 20px 60px rgba(0,0,0,.35)',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 80% 15%, ${item.palette?.soft || 'rgba(139,92,246,.12)'}, transparent 38%)` }} />
                      <div className="relative h-full p-7 md:p-10 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl" style={{ color: accent }}>{item.icon}</span>
                          <span className="text-[10px] uppercase tracking-[0.24em] text-white/25">{String(item.count).padStart(2, '0')} courses</span>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.28em] text-white/30 mb-4">{item.isAll ? 'The full catalogue' : 'Learning domain'}</div>
                          <h3 className="text-4xl md:text-5xl font-semibold tracking-[-0.045em] text-white">{item.name}</h3>
                          <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-white/40">
                            {item.isAll ? 'Browse every course currently available on LearnX.' : `Explore ${item.count} course${item.count === 1 ? '' : 's'} currently available in ${item.name}.`}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/25">Explore</span>
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${isActive ? 'bg-white text-black' : 'bg-white/5 text-white/60'}`}>
                            {item.isAll ? 'Browse all' : 'Explore'} <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
              <button type="button" onClick={() => changeExplore(-1)} className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/10 transition-colors" aria-label="Previous learning domain">
                <ChevronRight className="w-4 h-4 rotate-180 mx-auto" />
              </button>
              <button type="button" onClick={() => changeExplore(1)} className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/10 transition-colors" aria-label="Next learning domain">
                <ChevronRight className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          {activeExploreItem && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">
              <div className="text-sm text-white/35">
                Viewing <span className="text-white/70">{activeExploreItem.name}</span> · {activeExploreItem.count} course{activeExploreItem.count === 1 ? '' : 's'}
              </div>
              <button
                type="button"
                onClick={() => activeExploreItem.isAll ? navigate('/courses') : goToDomain(activeExploreItem.name)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
              >
                {activeExploreItem.isAll ? 'Browse all courses' : `Explore ${activeExploreItem.name}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* LEARNING PROCESS */}
      <AnimatedSection className="px-6 py-28 md:py-36 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4">The learning loop</p>
              <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.05em]">Learning is not a video.<br /><span className="text-white/35">It's a loop.</span></h2>
              <p className="mt-6 max-w-md text-white/45 leading-relaxed">Content starts the process. Practice, creation and reflection turn it into capability.</p>
            </div>
            <div className="divide-y divide-white/[0.08] border-t border-white/[0.08]">
              {PROCESS.map((step) => (
                <motion.div key={step.number} whileHover={{ x: 8 }} className="group py-8 md:py-10 grid grid-cols-[56px_1fr_auto] gap-5 items-start cursor-default">
                  <div className="text-xs text-white/25 pt-1">{step.number}</div>
                  <div>
                    <h3 className="text-2xl md:text-4xl font-semibold tracking-[-0.03em] group-hover:text-white transition-colors">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                  <step.icon className="w-5 h-5 text-white/20 group-hover:text-white/70 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* REAL CATALOGUE */}
      <AnimatedSection className="px-6 py-28 md:py-36">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4">From the catalogue</p>
              <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.05em]">Find something worth<br /><span className="text-white/35">going deep on.</span></h2>
            </div>
            <Link to="/courses" className="group inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors">Open full catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{[0,1,2,3,4,5].map((i) => <div key={i} className="h-80 rounded-2xl bg-white/[0.035] animate-pulse" />)}</div>
          ) : featuredCourses.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCourses.map((course, index) => (
                <motion.div key={course._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} onClick={() => navigate(`/courses/${course._id}`)} className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden hover:bg-white/[0.045] hover:border-white/[0.16] transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img src={resolveCourseThumbnail(course)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => applyThumbnailFallback(e, course)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070b] via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-4 text-xs text-white/60">{course.category || 'General'}</div>
                    <div className="absolute right-4 bottom-4 text-xs font-medium text-white/85">{course.price === 0 ? 'Free' : `₹${course.price}`}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium leading-snug line-clamp-2 group-hover:text-white/80">{course.title}</h3>
                    <p className="mt-2 text-sm text-white/35 line-clamp-2 leading-relaxed">{course.description}</p>
                    <div className="mt-5 flex items-center justify-between text-xs text-white/30">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || 'Self-paced'}</span>
                      <span className="inline-flex items-center gap-1 text-white/45">Open <ArrowRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-white/[0.08] rounded-2xl text-white/40">Courses will appear here as the catalogue grows.</div>
          )}
        </div>
      </AnimatedSection>

      {/* PRINCIPLES */}
      <AnimatedSection className="px-6 py-28 md:py-36 bg-white/[0.018] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4">What LearnX is becoming</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.05em]">A platform that adapts to the learner,<br /><span className="text-white/35">not the other way around.</span></h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="border-t border-white/10 pt-6"><div className="text-xs uppercase tracking-[0.2em] text-white/30">01 — Content</div><p className="mt-4 text-white/55 leading-relaxed">Human-created learning and AI-assisted creation can coexist. AI accelerates production; it does not define the platform.</p></div>
            <div className="border-t border-white/10 pt-6"><div className="text-xs uppercase tracking-[0.2em] text-white/30">02 — Discovery</div><p className="mt-4 text-white/55 leading-relaxed">The catalogue should remain explorable whether it contains dozens of courses or millions.</p></div>
            <div className="border-t border-white/10 pt-6"><div className="text-xs uppercase tracking-[0.2em] text-white/30">03 — Ecosystem</div><p className="mt-4 text-white/55 leading-relaxed">Learners, educators, organizations and credential partners will eventually share one infrastructure.</p></div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="px-6 py-32 md:py-40">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-6">Your next subject is waiting</p>
          <h2 className="text-5xl md:text-7xl font-semibold tracking-[-0.055em]">Choose a direction.<br /><span className="text-white/35">Then go deeper.</span></h2>
          <p className="max-w-xl mx-auto mt-7 text-white/40 leading-relaxed">Explore the current catalogue today. The learning space will grow with what gets created tomorrow.</p>
          <div className="mt-9"><Link to="/courses" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-medium hover:bg-white/90">Explore LearnX <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link></div>
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
