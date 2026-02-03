const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    razorpayOrderId: String,
    progress: {
        type: Number,
        default: 0,
    },
    completedLessons: [String], // Array of lesson IDs
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
