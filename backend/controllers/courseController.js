const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('instructor', 'name');
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res, next) => {
    try {
        req.body.instructor = req.user.id;

        const course = await Course.create(req.body);

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Make sure user is course instructor or admin
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('User not authorized to update this course');
        }

        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('User not authorized to delete this course');
        }

        await course.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
