const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    thumbnail: {
        type: String,
        // Use a real default URL so the UI doesn't end up with a broken image
        // when no thumbnail is provided.
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    // Extra fields used by the frontend
    duration: {
        type: String,
        default: '',
        trim: true,
    },
    // Some UI parts use "difficulty" while seed data uses "level".
    // Keep both to avoid breaking existing data.
    level: {
        type: String,
        default: '',
        trim: true,
    },
    difficulty: {
        type: String,
        default: '',
        trim: true,
    },
    originalPrice: {
        type: Number,
        default: null,
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sections: [
        {
            title: String,
            content: [
                {
                    title: String,
                    type: {
                        type: String,
                        enum: ['video', 'pdf', 'quiz', 'assignment', 'text'],
                    },
                    url: String,
                    duration: String,
                    script: String,
                    keyPoints: [String],
                    visualPrompts: [String],
                    examples: [String]
                }
            ]
        }
    ],
    aiGenerated: {
        type: Boolean,
        default: false
    },
    quizzes: [
        {
            question: String,
            options: [String],
            correct: Number,
            explanation: String
        }
    ],
    learningOutcomes: [String],
    prerequisites: [String],
    studentsEnrolled: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    // Enhanced rating fields for reviews
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    ratingDistribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', courseSchema);
