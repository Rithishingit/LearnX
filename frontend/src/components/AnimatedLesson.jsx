import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
    Maximize, Settings, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';

const AnimatedLesson = ({ lesson, onComplete, onNext }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [showText, setShowText] = useState(true);
    const intervalRef = useRef(null);

    // Parse lesson content for slides
    const slides = lesson?.visualPrompts?.map((prompt, index) => ({
        id: index,
        visual: prompt,
        narration: lesson.script?.split('.').slice(index * 2, (index + 1) * 2 + 1).join('. ') || '',
        keyPoints: lesson.keyPoints?.slice(index, index + 2) || [],
        animationType: getAnimationType(prompt)
    })) || generateDefaultSlides(lesson);

    function generateDefaultSlides(lesson) {
        return [
            { id: 0, visual: 'intro', narration: lesson?.script?.substring(0, 200) || 'Welcome to this lesson!', keyPoints: lesson?.keyPoints?.slice(0, 2) || [], animationType: 'fade' },
            { id: 1, visual: 'content', narration: lesson?.script?.substring(200, 400) || 'Let\'s learn together.', keyPoints: lesson?.keyPoints?.slice(2, 4) || [], animationType: 'slide' },
            { id: 2, visual: 'summary', narration: lesson?.script?.substring(400) || 'Great job completing this lesson!', keyPoints: [], animationType: 'zoom' }
        ];
    }

    function getAnimationType(prompt) {
        const p = prompt?.toLowerCase() || '';
        if (p.includes('code')) return 'typing';
        if (p.includes('flow') || p.includes('data')) return 'flow';
        if (p.includes('celebration')) return 'confetti';
        return 'fade';
    }

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        if (currentSlide < slides.length - 1) {
                            setCurrentSlide(c => c + 1);
                            return 0;
                        } else {
                            setIsPlaying(false);
                            onComplete?.();
                            return 100;
                        }
                    }
                    return prev + 0.5;
                });
            }, 50);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isPlaying, currentSlide, slides.length, onComplete]);

    const handleSlideChange = (direction) => {
        setProgress(0);
        if (direction === 'next' && currentSlide < slides.length - 1) {
            setCurrentSlide(c => c + 1);
        } else if (direction === 'prev' && currentSlide > 0) {
            setCurrentSlide(c => c - 1);
        }
    };

    const currentSlideData = slides[currentSlide] || slides[0];

    // Animated visuals based on type
    const getVisualComponent = () => {
        const type = currentSlideData.animationType;
        
        const visualStyles = {
            base: {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }
        };

        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];

        return (
            <div style={{ ...visualStyles.base, background: gradients[currentSlide % gradients.length] }}>
                {/* Animated background particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: Math.random() * 20 + 10,
                            height: Math.random() * 20 + 10,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                        }}
                        animate={{
                            x: [Math.random() * 800, Math.random() * 800],
                            y: [Math.random() * 400, Math.random() * 400],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        textAlign: 'center',
                        padding: '2rem',
                        zIndex: 10
                    }}
                >
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: type === 'confetti' ? [0, 10, -10, 0] : 0
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            fontSize: '5rem',
                            marginBottom: '1rem',
                            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                        }}
                    >
                        {currentSlide === 0 && '👋'}
                        {currentSlide === 1 && '💡'}
                        {currentSlide === 2 && '🎯'}
                        {currentSlide > 2 && ['🚀', '⭐', '🔥', '✨'][currentSlide % 4]}
                    </motion.div>

                    {/* Visual prompt text */}
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            color: 'white',
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        {currentSlideData.visual}
                    </motion.h2>

                    {/* Key points appearing */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {currentSlideData.keyPoints.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.3 }}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '50px',
                                    color: 'white',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Sparkles size={16} /> {point}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Typing animation for code */}
                {type === 'typing' && (
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            left: '2rem',
                            right: '2rem',
                            background: '#1e1e1e',
                            borderRadius: '12px',
                            padding: '1rem',
                            fontFamily: 'monospace'
                        }}
                    >
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3 }}
                            style={{ 
                                display: 'inline-block', 
                                overflow: 'hidden', 
                                whiteSpace: 'nowrap',
                                color: '#4ec9b0'
                            }}
                        >
                            const learning = "fun";
                        </motion.span>
                    </motion.div>
                )}
            </div>
        );
    };

    return (
        <div style={{ 
            width: '100%', 
            background: '#000',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Video/Animation Area */}
            <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {getVisualComponent()}
                </AnimatePresence>

                {/* Narration text overlay */}
                <AnimatePresence>
                    {showText && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            style={{
                                position: 'absolute',
                                bottom: '80px',
                                left: '1rem',
                                right: '1rem',
                                background: 'rgba(0,0,0,0.8)',
                                backdropFilter: 'blur(10px)',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                lineHeight: 1.6
                            }}
                        >
                            {currentSlideData.narration}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Slide indicator */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    color: 'white',
                    fontSize: '0.9rem'
                }}>
                    {currentSlide + 1} / {slides.length}
                </div>
            </div>

            {/* Controls */}
            <div style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                padding: '1rem',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0
            }}>
                {/* Progress bar */}
                <div style={{
                    height: '4px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '2px',
                    marginBottom: '1rem',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        style={{
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: '2px'
                        }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                {/* Control buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={() => handleSlideChange('prev')}
                            disabled={currentSlide === 0}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                opacity: currentSlide === 0 ? 0.3 : 1
                            }}
                        >
                            <SkipBack size={24} />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                background: 'var(--primary)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.75rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <button
                            onClick={() => handleSlideChange('next')}
                            disabled={currentSlide === slides.length - 1}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                opacity: currentSlide === slides.length - 1 ? 0.3 : 1
                            }}
                        >
                            <SkipForward size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        <button
                            onClick={() => setShowText(!showText)}
                            style={{
                                background: showText ? 'var(--primary)' : 'transparent',
                                border: '1px solid white',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                            }}
                        >
                            CC
                        </button>

                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedLesson;
