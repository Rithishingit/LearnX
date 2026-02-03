const express = require('express');
const { getAdminOverview } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', protect, authorize('admin'), getAdminOverview);

module.exports = router;
