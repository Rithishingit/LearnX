const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: function() { return !this.oauthProvider; },
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    profilePic: {
        type: String,
        default: 'default-avatar.png',
    },
    bio: String,
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        }
    ],
    // OAuth providers
    oauthProvider: {
        type: String,
        enum: ['google', 'github', 'microsoft', null],
        default: null,
    },
    oauthId: String,
    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    // Gamification
    points: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    badges: [{
        id: String,
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
        description: String,
    }],
    streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastActivity: Date,
    },
    // Certificates
    certificates: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        courseName: String,
        issuedAt: { type: Date, default: Date.now },
        certificateId: String,
        grade: String,
    }],
    // Learning stats
    totalLearningTime: { type: Number, default: 0 }, // in minutes
    coursesCompleted: { type: Number, default: 0 },
    quizzesPassed: { type: Number, default: 0 },
    // Social
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    // Settings
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
    const verifyToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    return verifyToken;
};

// Calculate level from points
userSchema.methods.calculateLevel = function () {
    const pointsPerLevel = 500;
    this.level = Math.floor(this.points / pointsPerLevel) + 1;
    return this.level;
};

// Add points and update level
userSchema.methods.addPoints = async function (amount, reason) {
    this.points += amount;
    this.calculateLevel();
    await this.save();
    return { points: this.points, level: this.level };
};

module.exports = mongoose.model('User', userSchema);
