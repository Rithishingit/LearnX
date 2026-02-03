const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
        });

        // Award signup bonus points
        user.points = 100;
        user.badges.push({
            id: 'newcomer',
            name: 'Newcomer',
            icon: '🌟',
            description: 'Joined the LearnX community',
        });
        await user.save();

        if (user) {
            sendToken(user, 201, res);
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide an email and password');
        }

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            sendToken(user, 200, res);
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
};

// Helper function to get token from model, create cookie and send response
const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
        options.sameSite = 'none';
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                points: user.points,
                level: user.level,
                badges: user.badges,
            },
        });
};

// @desc    OAuth login/register (Google, GitHub, Facebook)
// @route   POST /api/auth/oauth
// @access  Public
exports.oauthLogin = async (req, res, next) => {
    try {
        const { provider, providerId, email, name, profilePic } = req.body;

        if (!provider || !providerId || !email) {
            return res.status(400).json({
                success: false,
                error: 'Missing OAuth credentials',
            });
        }

        // Check if user exists with this OAuth provider
        let user = await User.findOne({ oauthProvider: provider, oauthId: providerId });

        if (!user) {
            // Check if email exists (link account)
            user = await User.findOne({ email });
            
            if (user) {
                // Link OAuth to existing account
                user.oauthProvider = provider;
                user.oauthId = providerId;
                if (profilePic) user.profilePic = profilePic;
                await user.save();
            } else {
                // Create new user
                user = await User.create({
                    name,
                    email,
                    oauthProvider: provider,
                    oauthId: providerId,
                    profilePic: profilePic || 'default-avatar.png',
                    isEmailVerified: true,
                    points: 100,
                    badges: [{
                        id: 'newcomer',
                        name: 'Newcomer',
                        icon: '🌟',
                        description: 'Joined the LearnX community',
                    }],
                });
            }
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No user found with that email',
            });
        }

        if (user.oauthProvider) {
            return res.status(400).json({
                success: false,
                error: `This account uses ${user.oauthProvider} login. Please sign in with ${user.oauthProvider}.`,
            });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to email',
            resetUrl,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired reset token',
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect',
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats for gamification
// @route   GET /api/auth/stats
// @access  Private
exports.getUserStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('enrolledCourses', 'title thumbnail')
            .populate('certificates.courseId', 'title thumbnail');

        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ user: req.user.id });
        
        const completedCourses = enrollments.filter(e => e.completed).length;
        const totalProgress = enrollments.reduce((acc, e) => acc + e.progress, 0);
        const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

        res.status(200).json({
            success: true,
            data: {
                points: user.points,
                level: user.level,
                badges: user.badges,
                streak: user.streak,
                certificates: user.certificates,
                totalLearningTime: user.totalLearningTime,
                coursesCompleted: completedCourses,
                coursesEnrolled: enrollments.length,
                avgProgress,
                quizzesPassed: user.quizzesPassed,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'student' })
            .select('name profilePic points level badges coursesCompleted')
            .sort({ points: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: users.map((user, index) => ({
                rank: index + 1,
                id: user._id,
                name: user.name,
                profilePic: user.profilePic,
                points: user.points,
                level: user.level,
                badgeCount: user.badges?.length || 0,
            })),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update learning streak
// @route   PUT /api/auth/streak
// @access  Private
exports.updateStreak = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (!user.streak) {
            user.streak = { current: 0, longest: 0, lastActivity: null };
        }

        const lastActivity = user.streak.lastActivity ? new Date(user.streak.lastActivity) : null;
        const lastActivityDate = lastActivity ? new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate()) : null;

        // If already logged activity today, just return current streak
        if (lastActivityDate && lastActivityDate.getTime() === today.getTime()) {
            return res.status(200).json({
                success: true,
                streak: user.streak,
                message: 'Already logged today',
            });
        }

        // Check if yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActivityDate && lastActivityDate.getTime() === yesterday.getTime()) {
            // Consecutive day
            user.streak.current += 1;
        } else if (!lastActivityDate || lastActivityDate.getTime() < yesterday.getTime()) {
            // Streak broken
            user.streak.current = 1;
        }

        // Update longest streak
        if (user.streak.current > user.streak.longest) {
            user.streak.longest = user.streak.current;
        }

        user.streak.lastActivity = now;

        // Award streak badges
        const streakMilestones = [
            { days: 7, id: 'week_warrior', name: 'Week Warrior', icon: '🔥' },
            { days: 30, id: 'month_master', name: 'Month Master', icon: '💪' },
            { days: 100, id: 'century_champ', name: 'Century Champion', icon: '🏆' },
        ];

        for (const milestone of streakMilestones) {
            if (user.streak.current >= milestone.days && !user.badges.some(b => b.id === milestone.id)) {
                user.badges.push({
                    id: milestone.id,
                    name: milestone.name,
                    icon: milestone.icon,
                    description: `Maintained a ${milestone.days}-day learning streak`,
                });
                user.points += milestone.days * 10;
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            streak: user.streak,
            points: user.points,
            newBadges: user.badges.filter(b => streakMilestones.some(m => m.id === b.id)),
        });
    } catch (error) {
        next(error);
    }
};
