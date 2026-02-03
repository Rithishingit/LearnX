const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get reviews for a course
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const reviews = await Review.find({ course: courseId })
            .populate('user', 'name avatar')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ course: courseId });

        // Get course rating stats
        const course = await Course.findById(courseId).select('averageRating totalReviews ratingDistribution');

        res.status(200).json({
            success: true,
            data: reviews,
            stats: {
                averageRating: course?.averageRating || 0,
                totalReviews: course?.totalReviews || 0,
                distribution: course?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            },
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create a review
// @route   POST /api/reviews/course/:courseId
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, title, text } = req.body;

        // Check if user is enrolled in course
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: courseId
        });

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: 'You must be enrolled in the course to leave a review'
            });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            user: req.user.id,
            course: courseId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }

        const review = await Review.create({
            course: courseId,
            user: req.user.id,
            rating,
            title,
            text,
            verified: enrollment.progress >= 50 // Verified if 50%+ complete
        });

        const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this course'
            });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        const { rating, title, text } = req.body;

        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, title, text },
            { new: true, runValidators: true }
        ).populate('user', 'name avatar');

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check ownership or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const helpfulIndex = review.helpful.indexOf(req.user.id);

        if (helpfulIndex > -1) {
            // Remove if already marked
            review.helpful.splice(helpfulIndex, 1);
        } else {
            // Add helpful vote
            review.helpful.push(req.user.id);
        }

        await review.save();

        res.status(200).json({
            success: true,
            data: {
                helpfulCount: review.helpful.length,
                isHelpful: helpfulIndex === -1
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add instructor reply to review
// @route   PUT /api/reviews/:id/reply
// @access  Private (Instructor)
exports.addInstructorReply = async (req, res) => {
    try {
        const { text } = req.body;

        const review = await Review.findById(req.params.id).populate('course');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user is course instructor
        if (review.course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Only the course instructor can reply to reviews'
            });
        }

        review.instructorReply = {
            text,
            date: new Date()
        };

        await review.save();

        const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

        res.status(200).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('course', 'title thumbnail')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
