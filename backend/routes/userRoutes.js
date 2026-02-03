const express = require('express');
const {
	getEnrollments,
	getProgress,
	getWishlist,
	addToWishlist,
	removeFromWishlist,
	toggleWishlist,
	getAllUsers,
	updateUserAdmin,
	deleteUserAdmin,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only: list all users
router.get('/', protect, authorize('admin'), getAllUsers);

router.get('/enrollments', protect, getEnrollments);
router.get('/progress/:courseId', protect, getProgress);

// Wishlist routes
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:courseId', protect, addToWishlist);
router.delete('/wishlist/:courseId', protect, removeFromWishlist);
router.put('/wishlist/:courseId', protect, toggleWishlist);

// Admin-only: update/delete a user (keep AFTER specific routes)
router.route('/:id')
	.put(protect, authorize('admin'), updateUserAdmin)
	.delete(protect, authorize('admin'), deleteUserAdmin);

module.exports = router;
