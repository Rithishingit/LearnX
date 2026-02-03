const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Course = require('../models/Course');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const AI_SYSTEM_PROMPT = `You are an expert educational content creator. Your role is to:
1. Create engaging, easy-to-understand lesson content
3. Structure courses with clear learning objectives
4. Generate quiz questions to test understanding
5. Provide real-world examples and analogies

Always format your response as valid JSON with the following structure:
{
    "sections": [
        {
            "title": "Section Title",
            "content": [
                {
                    "title": "Lesson Title",
                    "type": "video",
                    "duration": "10:00",
                    "script": "Full lesson narration script for animated video",
                    "keyPoints": ["point1", "point2"],
                    "visualPrompts": ["description for visual 1", "description for visual 2"],
                    "examples": ["example1", "example2"]
                }
            ]
        }
    ],
    "quizzes": [
        {
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why this is correct"
        }
    ],
    "summary": "Course summary",
    "prerequisites": ["prereq1", "prereq2"],
    "learningOutcomes": ["outcome1", "outcome2"]
}`;
router.post('/generate-course', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const { 
            courseName, 
            targetAudience, 
            difficulty, 
            duration,
            instructorNotes,
            qna // Instructor Q&A for context
        } = req.body;

        if (!courseName) {
            return res.status(400).json({ success: false, message: 'Course name is required' });
        }

        const userPrompt = `
Create a comprehensive course on: "${courseName}"

Target Audience: ${targetAudience || 'Beginners'}
Difficulty Level: ${difficulty || 'Beginner'}
Estimated Duration: ${duration || '10 hours'}

Instructor Notes: ${instructorNotes || 'None provided'}

Additional Context from Instructor Q&A:
${qna ? qna.map(q => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n') : 'None'}

Create:
1. 3-5 main sections with 3-4 lessons each
2. Each lesson should have a detailed script for animated video (2-3 paragraphs)
3. Visual prompts for each lesson (what animations/graphics to show)
4. Real-world examples and analogies
5. 5-10 quiz questions with explanations
6. Clear learning outcomes

Make the content engaging, using storytelling techniques and relatable examples.
Format as cartoon/animated video scripts suitable for visual learning.`;

        let courseContent;
        
        if (OPENAI_API_KEY) {
            courseContent = await callOpenAI(userPrompt);
        } else {
            courseContent = await generateBuiltInContent(courseName, targetAudience, difficulty);
        }

        res.status(200).json({
            success: true,
            message: 'Course content generated successfully',
            data: courseContent
        });
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/create-course', protect, authorize('instructor', 'admin'), async (req, res) => {
    try {
        const { courseName, description, category, price, aiContent } = req.body;

        const sections = aiContent.sections.map(section => ({
            title: section.title,
            content: section.content.map(lesson => ({
                title: lesson.title,
                type: lesson.type || 'video',
                duration: lesson.duration,
                url: '',
                script: lesson.script,
                keyPoints: lesson.keyPoints,
                visualPrompts: lesson.visualPrompts
            }))
        }));

        const course = await Course.create({
            title: courseName,
            description,
            category,
            price: price || 0,
            instructor: req.user._id,
            sections,
            thumbnail: generateCourseThumbnail(category),
            aiGenerated: true,
            quizzes: aiContent.quizzes,
            learningOutcomes: aiContent.learningOutcomes,
            prerequisites: aiContent.prerequisites
        });

        res.status(201).json({
            success: true,
            message: 'AI-powered course created!',
            data: course
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
router.post('/generate-lesson-video', protect, async (req, res) => {
    try {
        const { lessonScript, visualPrompts, lessonTitle } = req.body;

        const videoContent = {
            title: lessonTitle,
            slides: visualPrompts.map((prompt, index) => ({
                id: index + 1,
                visualDescription: prompt,
                narration: lessonScript.split('.').slice(index * 2, (index + 1) * 2).join('.'),
                animationType: getAnimationType(prompt),
                duration: 15 // seconds per slide
            })),
            totalDuration: visualPrompts.length * 15,
            audioUrl: null,
            status: 'ready'
        };

        res.status(200).json({
            success: true,
            data: videoContent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
async function callOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: AI_SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
        })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}
async function generateBuiltInContent(courseName, audience, difficulty) {
    const templates = {
        programming: {
            sections: [
                {
                    title: 'Introduction & Setup',
                    content: [
                        {
                            title: `Welcome to ${courseName}`,
                            type: 'video',
                            duration: '8:00',
                            script: `Welcome to this exciting journey into ${courseName}! Imagine you're learning to build something amazing - like a master craftsman learning their first tools. In this course, we'll start from the very basics and build your skills step by step. By the end, you'll be confident and ready to create your own projects. Let's begin this adventure together!`,
                            keyPoints: ['Course overview', 'What you will learn', 'How to succeed'],
                            visualPrompts: ['Animated welcome screen with course logo', 'Journey roadmap showing milestones', 'Student avatar starting their learning path'],
                            examples: ['Real-world applications', 'Success stories from learners']
                        },
                        {
                            title: 'Setting Up Your Environment',
                            type: 'video',
                            duration: '12:00',
                            script: `Before we start coding, we need to set up our workspace. Think of it like setting up a kitchen before cooking - you need the right tools in the right places. We'll install the necessary software step by step, and I'll show you exactly what each tool does. Don't worry if this seems technical - by the end of this lesson, you'll have everything ready to go!`,
                            keyPoints: ['Required software', 'Installation steps', 'Verifying setup'],
                            visualPrompts: ['Animated computer screen showing installation', 'Checkmarks appearing as each step completes', 'Celebration animation when setup is done'],
                            examples: ['Common setup issues and solutions']
                        }
                    ]
                },
                {
                    title: 'Core Concepts',
                    content: [
                        {
                            title: 'Understanding the Fundamentals',
                            type: 'video',
                            duration: '15:00',
                            script: `Now let's dive into the heart of ${courseName}. Imagine you're learning to read - first you learn the alphabet, then words, then sentences. Programming works the same way! We'll start with the building blocks: variables are like labeled boxes where we store information, and functions are like recipes that tell the computer what to do. Let's explore these concepts with fun, visual examples!`,
                            keyPoints: ['Variables and data types', 'Basic operations', 'Control flow'],
                            visualPrompts: ['Animated boxes labeled as variables', 'Data flowing through pipes', 'Interactive code examples with highlighting'],
                            examples: ['Storing your name in a variable', 'Calculating simple math']
                        },
                        {
                            title: 'Building Your First Project',
                            type: 'video',
                            duration: '20:00',
                            script: `This is the exciting part - we're going to build something real! Remember learning to ride a bike? At first it seems impossible, but once you get it, it feels amazing. We'll create a simple but complete project that uses everything we've learned. You'll be able to show this to friends and family as proof of your new skills!`,
                            keyPoints: ['Project planning', 'Writing code step by step', 'Testing and debugging'],
                            visualPrompts: ['Blueprint/planning animation', 'Code being written with explanations', 'Project coming to life with animations'],
                            examples: ['Building a calculator', 'Creating a simple game']
                        }
                    ]
                },
                {
                    title: 'Advanced Topics',
                    content: [
                        {
                            title: 'Taking It Further',
                            type: 'video',
                            duration: '18:00',
                            script: `You've come so far! Now let's level up your skills with some advanced techniques. These are the secrets that separate beginners from professionals. We'll cover best practices that the experts use, and you'll learn patterns that make your code cleaner and more efficient. Think of this as getting your black belt in ${courseName}!`,
                            keyPoints: ['Best practices', 'Code organization', 'Performance tips'],
                            visualPrompts: ['Leveling up animation', 'Before/after code comparisons', 'Expert tips appearing as cards'],
                            examples: ['Refactoring code', 'Optimization techniques']
                        }
                    ]
                }
            ],
            quizzes: [
                {
                    question: `What is the main purpose of ${courseName}?`,
                    options: ['To make computers faster', 'To create software and solve problems', 'To replace humans', 'To break things'],
                    correct: 1,
                    explanation: 'Programming is fundamentally about creating solutions and building software that solves real-world problems.'
                },
                {
                    question: 'What is a variable in programming?',
                    options: ['A type of computer', 'A container that stores data', 'A programming language', 'An error message'],
                    correct: 1,
                    explanation: 'Variables are like labeled containers that hold data values which can be used and modified in your program.'
                },
                {
                    question: 'Why is it important to test your code?',
                    options: ['To make it look pretty', 'To find and fix errors before users do', 'Because teachers require it', 'Testing is not important'],
                    correct: 1,
                    explanation: 'Testing helps you catch bugs and errors early, ensuring your program works correctly for all users.'
                }
            ],
            summary: `This comprehensive course on ${courseName} takes you from complete beginner to confident practitioner through hands-on projects and visual learning.`,
            prerequisites: ['Basic computer skills', 'Curiosity and willingness to learn'],
            learningOutcomes: [
                `Understand the core concepts of ${courseName}`,
                'Build real projects from scratch',
                'Debug and solve problems independently',
                'Apply best practices used by professionals'
            ]
        }
    };

    // Return programming template (can be expanded for other categories)
    return templates.programming;
}
function generateCourseThumbnail(category) {
    const thumbnails = {
        'Programming': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'Web Development': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg',
        'Data Science': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg',
        'Mobile Development': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg',
        'default': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg'
    };
    return thumbnails[category] || thumbnails.default;
}
function getAnimationType(prompt) {
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('code') || promptLower.includes('programming')) return 'typing';
    if (promptLower.includes('flow') || promptLower.includes('data')) return 'flow';
    if (promptLower.includes('comparison') || promptLower.includes('before')) return 'split';
    if (promptLower.includes('celebration') || promptLower.includes('success')) return 'confetti';
    return 'fade';
}

module.exports = router;
