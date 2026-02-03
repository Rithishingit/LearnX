const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const User = require('../models/User');

const msToHuman = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (mins || parts.length === 0) parts.push(`${mins}m`);
    return parts.join(' ');
};

// @desc    Get admin overview stats (computed from existing DB models)
// @route   GET /api/admin/overview
// @access  Private (Admin)
exports.getAdminOverview = async (req, res, next) => {
    try {
        const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalReviews,
            pendingReviews,
            activeUsers,
            newUsers7d,
            newCourses7d,
            newEnrollments7d,
            newReviews7d,
            completedEnrollments
        ] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            Review.countDocuments(),
            Review.countDocuments({ verified: false }),
            User.countDocuments({ 'streak.current': { $gt: 0 } }),
            User.countDocuments({ createdAt: { $gte: since7d } }),
            Course.countDocuments({ createdAt: { $gte: since7d } }),
            Enrollment.countDocuments({ enrolledAt: { $gte: since7d } }),
            Review.countDocuments({ createdAt: { $gte: since7d } }),
            Enrollment.countDocuments({ status: 'completed' }),
        ]);

        // Revenue: sum(course.price) for paid enrollments (only what exists in our DB)
        const revenueAgg = await Enrollment.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'course',
                    foreignField: '_id',
                    as: 'courseDoc'
                }
            },
            { $unwind: { path: '$courseDoc', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $ifNull: ['$courseDoc.price', 0] } },
                }
            }
        ]);
        const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;

        // Average rating across all reviews
        const ratingAgg = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                }
            }
        ]);
        const avgRating = ratingAgg?.[0]?.avgRating ? Math.round(ratingAgg[0].avgRating * 10) / 10 : 0;

        const completionRate = totalEnrollments > 0
            ? Math.round((completedEnrollments / totalEnrollments) * 1000) / 10
            : 0;

        // Recent activity (real docs)
        const [latestUsers, latestCourses, latestEnrollments, latestReviews] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
            Course.find().sort({ createdAt: -1 }).limit(5).select('title price createdAt instructor').populate('instructor', 'name email'),
            Enrollment.find().sort({ enrolledAt: -1 }).limit(5).populate('user', 'name email').populate('course', 'title price').select('enrolledAt paymentStatus status'),
            Review.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('course', 'title').select('rating title createdAt verified'),
        ]);

        const activity = [
            ...latestUsers.map((u) => ({
                type: 'user',
                at: u.createdAt,
                action: 'New user registered',
                detail: u.email,
            })),
            ...latestCourses.map((c) => ({
                type: 'course',
                at: c.createdAt,
                action: 'Course published',
                detail: c.title,
            })),
            ...latestEnrollments.map((e) => ({
                type: 'enrollment',
                at: e.enrolledAt,
                action: 'New enrollment',
                detail: `${e.user?.name || 'User'} → ${e.course?.title || 'Course'}`,
            })),
            ...latestReviews.map((r) => ({
                type: 'review',
                at: r.createdAt,
                action: 'Review submitted',
                detail: `${r.rating}★ on ${r.course?.title || 'Course'}`,
            })),
        ]
            .filter((x) => x.at)
            .sort((a, b) => new Date(b.at) - new Date(a.at))
            .slice(0, 10);

        const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected
        const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalCourses,
                    totalEnrollments,
                    totalReviews,
                    pendingReviews,
                    activeUsers,
                    totalRevenue,
                },
                last7Days: {
                    newUsers: newUsers7d,
                    newCourses: newCourses7d,
                    newEnrollments: newEnrollments7d,
                    newReviews: newReviews7d,
                },
                quality: {
                    avgRating,
                    completionRate,
                },
                system: {
                    serverUptimeSeconds: Math.floor(process.uptime()),
                    serverUptimeHuman: msToHuman(process.uptime() * 1000),
                    dbStatus,
                },
                recentActivity: activity,
            }
        });
    } catch (error) {
        next(error);
    }
};
