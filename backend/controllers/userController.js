const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get user enrollments
// @route   GET /api/users/enrollments
// @access  Private
exports.getEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id })
            .populate('course', 'title thumbnail');

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist', 'title thumbnail price category instructor averageRating studentsEnrolled');
        
        res.status(200).json({
            success: true,
            count: user.wishlist?.length || 0,
            data: user.wishlist || [],
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:courseId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (user.wishlist.includes(req.params.courseId)) {
            return res.status(400).json({ success: false, message: 'Course already in wishlist' });
        }

        user.wishlist.push(req.params.courseId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Added to wishlist',
            data: user.wishlist,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:courseId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.courseId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Removed from wishlist',
            data: user.wishlist,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle wishlist (add/remove)
// @route   PUT /api/users/wishlist/:courseId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const courseId = req.params.courseId;
        
        const index = user.wishlist.findIndex(id => id.toString() === courseId);
        let action;

        if (index > -1) {
            user.wishlist.splice(index, 1);
            action = 'removed';
        } else {
            user.wishlist.push(courseId);
            action = 'added';
        }

        await user.save();

        res.status(200).json({
            success: true,
            action,
            inWishlist: action === 'added',
            data: user.wishlist,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get progress for a course
// @route   GET /api/users/progress/:courseId
// @access  Private
exports.getProgress = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: req.params.courseId
        }).populate('course');

        if (!enrollment) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        res.status(200).json({
            success: true,
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a user (admin) - currently supports role update
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUserAdmin = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'No updates provided',
            });
        }

        const allowedRoles = ['student', 'instructor', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role',
            });
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Extra safety: avoid self-demote/role-change via API (UI already blocks)
        if (targetUser._id.toString() === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot change your own role',
            });
        }

        targetUser.role = role;
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: 'User updated',
            data: targetUser,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUserAdmin = async (req, res, next) => {
    try {
        if (req.params.id.toString() === req.user.id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Clean up related data that exists in this project
        await Promise.all([
            Enrollment.deleteMany({ user: user._id }),
            Review.deleteMany({ user: user._id }),
        ]);

        await User.deleteOne({ _id: user._id });

        res.status(200).json({
            success: true,
            message: 'User deleted',
        });
    } catch (error) {
        next(error);
    }
};
