const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { courseId } = req.body;
        
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            user: req.user._id,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            user: req.user._id,
            course: courseId,
            paymentStatus: course.price === 0 ? 'paid' : 'pending',
            status: 'active'
        });

        // Update course student count
        await Course.findByIdAndUpdate(courseId, {
            $inc: { studentsEnrolled: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled!',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/enrollments
// @desc    Get user's enrollments
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('course', 'title description thumbnail category price rating')
            .sort('-enrolledAt');

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/enrollments/my
// @desc    Get user's enrollments (alias)
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('course', 'title description thumbnail category price rating')
            .sort('-enrolledAt');

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/enrollments/:courseId
// @desc    Check if enrolled in a course
// @access  Public (returns not enrolled if not authenticated)
router.get('/:courseId', optionalAuth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json({
                success: true,
                enrolled: false,
                data: null
            });
        }

        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        });

        res.status(200).json({
            success: true,
            enrolled: !!enrollment,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/enrollments/:courseId/progress
// @desc    Update course progress
// @access  Private
router.put('/:courseId/progress', protect, async (req, res) => {
    try {
        const { progress, completedLessons } = req.body;

        const enrollment = await Enrollment.findOneAndUpdate(
            { user: req.user._id, course: req.params.courseId },
            { 
                progress,
                completedLessons,
                ...(progress >= 100 ? { status: 'completed' } : {})
            },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
