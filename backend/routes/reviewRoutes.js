const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCourseReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    addInstructorReply,
    getMyReviews
} = require('../controllers/reviewController');

// Public routes
router.get('/course/:courseId', getCourseReviews);

// Protected routes
router.post('/course/:courseId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);
router.put('/:id/reply', protect, addInstructorReply);
router.get('/my-reviews', protect, getMyReviews);

module.exports = router;
