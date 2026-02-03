const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    text: {
        type: String,
        required: [true, 'Please provide review text'],
        maxlength: [1000, 'Review cannot be more than 1000 characters']
    },
    helpful: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    verified: {
        type: Boolean,
        default: false
    },
    instructorReply: {
        text: String,
        date: Date
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function(courseId) {
    const stats = await this.aggregate([
        { $match: { course: courseId } },
        {
            $group: {
                _id: '$course',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                ratings: {
                    $push: '$rating'
                }
            }
        }
    ]);

    try {
        const Course = require('./Course');
        if (stats.length > 0) {
            // Calculate rating distribution
            const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            stats[0].ratings.forEach(r => distribution[r]++);
            
            await Course.findByIdAndUpdate(courseId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10,
                totalReviews: stats[0].totalReviews,
                ratingDistribution: distribution
            });
        } else {
            await Course.findByIdAndUpdate(courseId, {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Update average after save
ReviewSchema.post('save', async function() {
    await this.constructor.getAverageRating(this.course);
});

// Update average after remove
ReviewSchema.post('remove', async function() {
    await this.constructor.getAverageRating(this.course);
});

// Update average after findOneAndDelete
ReviewSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await doc.constructor.getAverageRating(doc.course);
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
