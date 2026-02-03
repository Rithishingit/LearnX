const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
    seedAllCourses();
}).catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
});

const seedAllCourses = async () => {
    try {
        // Get or create instructor
        let instructor = await User.findOne({ role: 'instructor' });
        
        if (!instructor) {
            instructor = await User.create({
                name: 'LearnX Instructor',
                email: 'instructor@learnx.com',
                password: 'password123',
                role: 'instructor'
            });
        }

        // Delete existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        const allCourses = [
            // ═══════════════════════════════════════════════════════════════
            // BUSINESS & MANAGEMENT
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'Business Strategy Masterclass',
                description: 'Learn strategic thinking, competitive analysis, and business model innovation. Master frameworks used by top executives.',
                price: 79.99,
                category: 'Business & Management',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
                studentsEnrolled: 2340,
                rating: 4.8,
                numReviews: 567,
                duration: '12h 30m',
                level: 'Intermediate',
                sections: [
                    { title: 'Strategic Foundations', content: [{ title: 'What is Strategy?', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'Project Management Professional (PMP)',
                description: 'Complete PMP certification preparation. Learn Agile, Scrum, Waterfall methodologies and pass the exam.',
                price: 149.99,
                category: 'Business & Management',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
                studentsEnrolled: 4520,
                rating: 4.9,
                numReviews: 1234,
                duration: '35h',
                level: 'Advanced',
                sections: [
                    { title: 'PMP Fundamentals', content: [{ title: 'Introduction to PMP', type: 'video', duration: '30 min' }] }
                ]
            },
            {
                title: 'Financial Analysis & Modeling',
                description: 'Master Excel financial modeling, valuation techniques, and investment analysis for business decisions.',
                price: 89.99,
                category: 'Business & Management',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop',
                studentsEnrolled: 1890,
                rating: 4.7,
                numReviews: 432,
                duration: '18h',
                level: 'Intermediate',
                sections: [
                    { title: 'Financial Basics', content: [{ title: 'Understanding Financial Statements', type: 'video', duration: '35 min' }] }
                ]
            },
            {
                title: 'Leadership & Team Management',
                description: 'Develop leadership skills, emotional intelligence, and learn to build high-performing teams.',
                price: 59.99,
                category: 'Business & Management',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop',
                studentsEnrolled: 3210,
                rating: 4.8,
                numReviews: 876,
                duration: '10h',
                level: 'Beginner',
                sections: [
                    { title: 'Leadership Fundamentals', content: [{ title: 'What Makes a Great Leader', type: 'video', duration: '20 min' }] }
                ]
            },
            {
                title: 'Entrepreneurship: Start Your Business',
                description: 'From idea to launch. Learn business planning, funding, marketing, and scaling your startup.',
                price: 0,
                category: 'Business & Management',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.6,
                numReviews: 1543,
                duration: '15h',
                level: 'Beginner',
                sections: [
                    { title: 'Getting Started', content: [{ title: 'Finding Your Business Idea', type: 'video', duration: '28 min' }] }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // TECHNOLOGY & IT
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'Full Stack Web Development',
                description: 'Complete web development bootcamp. Master HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
                price: 99.99,
                category: 'Technology & IT',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f0?w=500&h=300&fit=crop',
                studentsEnrolled: 8920,
                rating: 4.9,
                numReviews: 2341,
                duration: '60h',
                level: 'Beginner',
                sections: [
                    { title: 'Web Fundamentals', content: [{ title: 'How the Web Works', type: 'video', duration: '20 min' }] }
                ]
            },
            {
                title: 'Python Programming Masterclass',
                description: 'Learn Python from scratch. Cover fundamentals, OOP, file handling, and build real-world projects.',
                price: 0,
                category: 'Technology & IT',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop',
                studentsEnrolled: 12450,
                rating: 4.8,
                numReviews: 3456,
                duration: '40h',
                level: 'Beginner',
                sections: [
                    { title: 'Python Basics', content: [{ title: 'Variables and Data Types', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'AWS Cloud Practitioner Certification',
                description: 'Complete AWS certification prep. Learn cloud computing, EC2, S3, Lambda, and pass the exam.',
                price: 129.99,
                category: 'Technology & IT',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
                studentsEnrolled: 4560,
                rating: 4.7,
                numReviews: 987,
                duration: '25h',
                level: 'Intermediate',
                sections: [
                    { title: 'Cloud Fundamentals', content: [{ title: 'What is Cloud Computing?', type: 'video', duration: '30 min' }] }
                ]
            },
            {
                title: 'Cybersecurity Fundamentals',
                description: 'Learn ethical hacking, network security, encryption, and protect systems from cyber threats.',
                price: 79.99,
                category: 'Technology & IT',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop',
                studentsEnrolled: 3210,
                rating: 4.8,
                numReviews: 654,
                duration: '20h',
                level: 'Intermediate',
                sections: [
                    { title: 'Security Basics', content: [{ title: 'Introduction to Cybersecurity', type: 'video', duration: '22 min' }] }
                ]
            },
            {
                title: 'Machine Learning with Python',
                description: 'Master ML algorithms, neural networks, and deep learning. Build AI models with TensorFlow and PyTorch.',
                price: 119.99,
                category: 'Technology & IT',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.9,
                numReviews: 1234,
                duration: '45h',
                level: 'Advanced',
                sections: [
                    { title: 'ML Fundamentals', content: [{ title: 'What is Machine Learning?', type: 'video', duration: '28 min' }] }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // CREATIVE & DESIGN
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'UI/UX Design Complete Guide',
                description: 'Master user interface and experience design. Learn Figma, prototyping, and design thinking.',
                price: 69.99,
                category: 'Creative & Design',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
                studentsEnrolled: 4560,
                rating: 4.8,
                numReviews: 1098,
                duration: '30h',
                level: 'Beginner',
                sections: [
                    { title: 'Design Principles', content: [{ title: 'Introduction to UI/UX', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'Adobe Photoshop Masterclass',
                description: 'Complete Photoshop training. Learn photo editing, manipulation, compositing, and graphic design.',
                price: 49.99,
                category: 'Creative & Design',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&h=300&fit=crop',
                studentsEnrolled: 7890,
                rating: 4.7,
                numReviews: 2134,
                duration: '25h',
                level: 'Beginner',
                sections: [
                    { title: 'Photoshop Basics', content: [{ title: 'Workspace Overview', type: 'video', duration: '20 min' }] }
                ]
            },
            {
                title: 'Motion Graphics & Animation',
                description: 'Create stunning animations with After Effects. Learn motion design principles and visual effects.',
                price: 89.99,
                category: 'Creative & Design',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop',
                studentsEnrolled: 2340,
                rating: 4.9,
                numReviews: 567,
                duration: '35h',
                level: 'Intermediate',
                sections: [
                    { title: 'Animation Basics', content: [{ title: 'Principles of Animation', type: 'video', duration: '30 min' }] }
                ]
            },
            {
                title: 'Logo & Brand Identity Design',
                description: 'Create memorable logos and brand identities. Learn design thinking and brand strategy.',
                price: 0,
                category: 'Creative & Design',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.6,
                numReviews: 1432,
                duration: '15h',
                level: 'Beginner',
                sections: [
                    { title: 'Branding Basics', content: [{ title: 'What is a Brand?', type: 'video', duration: '22 min' }] }
                ]
            },
            {
                title: '3D Modeling with Blender',
                description: 'Learn 3D modeling, texturing, lighting, and rendering with the free Blender software.',
                price: 59.99,
                category: 'Creative & Design',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&h=300&fit=crop',
                studentsEnrolled: 3450,
                rating: 4.8,
                numReviews: 876,
                duration: '40h',
                level: 'Intermediate',
                sections: [
                    { title: 'Blender Basics', content: [{ title: 'Interface Overview', type: 'video', duration: '28 min' }] }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // HEALTH & WELLNESS
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'Nutrition & Diet Planning',
                description: 'Learn evidence-based nutrition science. Create personalized meal plans for health goals.',
                price: 49.99,
                category: 'Health & Wellness',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=300&fit=crop',
                studentsEnrolled: 4560,
                rating: 4.7,
                numReviews: 1123,
                duration: '12h',
                level: 'Beginner',
                sections: [
                    { title: 'Nutrition Basics', content: [{ title: 'Understanding Macronutrients', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'Yoga for Beginners',
                description: 'Start your yoga journey. Learn poses, breathing techniques, and develop a daily practice.',
                price: 0,
                category: 'Health & Wellness',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop',
                studentsEnrolled: 8920,
                rating: 4.9,
                numReviews: 2345,
                duration: '10h',
                level: 'Beginner',
                sections: [
                    { title: 'Getting Started', content: [{ title: 'Your First Yoga Session', type: 'video', duration: '30 min' }] }
                ]
            },
            {
                title: 'Mental Health & Stress Management',
                description: 'Learn coping strategies, mindfulness, and techniques to manage anxiety and improve wellbeing.',
                price: 39.99,
                category: 'Health & Wellness',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.8,
                numReviews: 1456,
                duration: '8h',
                level: 'Beginner',
                sections: [
                    { title: 'Understanding Stress', content: [{ title: 'What is Stress?', type: 'video', duration: '20 min' }] }
                ]
            },
            {
                title: 'Fitness & Strength Training',
                description: 'Build muscle, lose fat, and get fit. Learn proper form, workout programming, and nutrition.',
                price: 59.99,
                category: 'Health & Wellness',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
                studentsEnrolled: 6780,
                rating: 4.7,
                numReviews: 1789,
                duration: '20h',
                level: 'Beginner',
                sections: [
                    { title: 'Fitness Fundamentals', content: [{ title: 'Getting Started with Fitness', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'First Aid & Emergency Response',
                description: 'Learn life-saving skills. CPR, wound care, emergency response, and basic medical procedures.',
                price: 29.99,
                category: 'Health & Wellness',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&h=300&fit=crop',
                studentsEnrolled: 3450,
                rating: 4.9,
                numReviews: 876,
                duration: '6h',
                level: 'Beginner',
                sections: [
                    { title: 'Emergency Basics', content: [{ title: 'Assessing an Emergency', type: 'video', duration: '22 min' }] }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // PERSONAL DEVELOPMENT
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'Productivity & Time Management',
                description: 'Master your time. Learn proven systems, habits, and tools to maximize productivity.',
                price: 0,
                category: 'Personal Development',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&h=300&fit=crop',
                studentsEnrolled: 9870,
                rating: 4.8,
                numReviews: 2567,
                duration: '8h',
                level: 'Beginner',
                sections: [
                    { title: 'Time Mastery', content: [{ title: 'Understanding Your Time', type: 'video', duration: '20 min' }] }
                ]
            },
            {
                title: 'Public Speaking & Presentation',
                description: 'Overcome fear and become a confident speaker. Learn storytelling and persuasion techniques.',
                price: 49.99,
                category: 'Personal Development',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&h=300&fit=crop',
                studentsEnrolled: 4560,
                rating: 4.7,
                numReviews: 1123,
                duration: '10h',
                level: 'Beginner',
                sections: [
                    { title: 'Speaking Basics', content: [{ title: 'Overcoming Fear', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'Critical Thinking & Problem Solving',
                description: 'Develop analytical skills, logical reasoning, and creative problem-solving abilities.',
                price: 39.99,
                category: 'Personal Development',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=500&h=300&fit=crop',
                studentsEnrolled: 3210,
                rating: 4.6,
                numReviews: 789,
                duration: '12h',
                level: 'Intermediate',
                sections: [
                    { title: 'Thinking Frameworks', content: [{ title: 'Introduction to Critical Thinking', type: 'video', duration: '28 min' }] }
                ]
            },
            {
                title: 'Communication Skills Mastery',
                description: 'Master verbal and written communication. Learn negotiation, conflict resolution, and influence.',
                price: 59.99,
                category: 'Personal Development',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.8,
                numReviews: 1432,
                duration: '15h',
                level: 'Beginner',
                sections: [
                    { title: 'Communication Basics', content: [{ title: 'The Art of Communication', type: 'video', duration: '22 min' }] }
                ]
            },
            {
                title: 'Goal Setting & Personal Growth',
                description: 'Set and achieve meaningful goals. Learn habit formation and personal development strategies.',
                price: 0,
                category: 'Personal Development',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
                studentsEnrolled: 7890,
                rating: 4.7,
                numReviews: 2134,
                duration: '6h',
                level: 'Beginner',
                sections: [
                    { title: 'Goal Setting', content: [{ title: 'Why Goals Matter', type: 'video', duration: '18 min' }] }
                ]
            },

            // ═══════════════════════════════════════════════════════════════
            // SCIENCE & RESEARCH
            // ═══════════════════════════════════════════════════════════════
            {
                title: 'Data Science & Analytics',
                description: 'Learn data analysis, visualization, and statistical methods. Work with real-world datasets.',
                price: 89.99,
                category: 'Science & Research',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
                studentsEnrolled: 6780,
                rating: 4.9,
                numReviews: 1789,
                duration: '40h',
                level: 'Intermediate',
                sections: [
                    { title: 'Data Science Basics', content: [{ title: 'Introduction to Data Science', type: 'video', duration: '30 min' }] }
                ]
            },
            {
                title: 'Research Methods & Methodology',
                description: 'Learn scientific research methods, experimental design, and academic writing skills.',
                price: 49.99,
                category: 'Science & Research',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=300&fit=crop',
                studentsEnrolled: 2340,
                rating: 4.6,
                numReviews: 567,
                duration: '15h',
                level: 'Intermediate',
                sections: [
                    { title: 'Research Basics', content: [{ title: 'What is Research?', type: 'video', duration: '25 min' }] }
                ]
            },
            {
                title: 'Environmental Science & Sustainability',
                description: 'Understand climate change, ecosystems, and sustainable development practices.',
                price: 0,
                category: 'Science & Research',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=500&h=300&fit=crop',
                studentsEnrolled: 4560,
                rating: 4.8,
                numReviews: 1098,
                duration: '20h',
                level: 'Beginner',
                sections: [
                    { title: 'Environmental Basics', content: [{ title: 'Our Planet', type: 'video', duration: '28 min' }] }
                ]
            },
            {
                title: 'Statistics for Everyone',
                description: 'Master statistics concepts, probability, and data interpretation for any field.',
                price: 39.99,
                category: 'Science & Research',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500&h=300&fit=crop',
                studentsEnrolled: 5670,
                rating: 4.7,
                numReviews: 1432,
                duration: '18h',
                level: 'Beginner',
                sections: [
                    { title: 'Statistics Basics', content: [{ title: 'Introduction to Statistics', type: 'video', duration: '22 min' }] }
                ]
            },
            {
                title: 'Astronomy & Space Science',
                description: 'Explore the universe. Learn about stars, planets, galaxies, and the latest space discoveries.',
                price: 29.99,
                category: 'Science & Research',
                instructor: instructor._id,
                thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=300&fit=crop',
                studentsEnrolled: 3450,
                rating: 4.9,
                numReviews: 876,
                duration: '12h',
                level: 'Beginner',
                sections: [
                    { title: 'Space Basics', content: [{ title: 'Our Solar System', type: 'video', duration: '30 min' }] }
                ]
            }
        ];

        // Insert all courses
        await Course.insertMany(allCourses);
        console.log(`✅ Created ${allCourses.length} courses across all categories!`);
        
        // Summary
        const categories = [...new Set(allCourses.map(c => c.category))];
        console.log('\n📊 Courses by Category:');
        for (const cat of categories) {
            const count = allCourses.filter(c => c.category === cat).length;
            console.log(`   ${cat}: ${count} courses`);
        }

        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};
