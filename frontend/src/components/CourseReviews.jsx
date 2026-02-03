import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Star, ThumbsUp, MessageCircle, Check, Award, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseReviews = ({ courseId, user, isEnrolled, isInstructor }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, title: '', text: '' });
    const [submitting, setSubmitting] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            const { data } = await API.get(`/reviews/course/${courseId}`);
            setReviews(data.data || []);
            setStats(data.stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.text.trim()) return;
        
        setSubmitting(true);
        try {
            if (editingReview) {
                await API.put(`/reviews/${editingReview._id}`, newReview);
            } else {
                await API.post(`/reviews/course/${courseId}`, newReview);
            }
            await fetchReviews();
            setShowWriteReview(false);
            setNewReview({ rating: 5, title: '', text: '' });
            setEditingReview(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await API.delete(`/reviews/${reviewId}`);
            await fetchReviews();
        } catch (error) {
            alert('Error deleting review');
        }
    };

    const handleHelpful = async (reviewId) => {
        try {
            await API.put(`/reviews/${reviewId}/helpful`);
            await fetchReviews();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInstructorReply = async (reviewId) => {
        if (!replyText.trim()) return;
        try {
            await API.put(`/reviews/${reviewId}/reply`, { text: replyText });
            await fetchReviews();
            setReplyingTo(null);
            setReplyText('');
        } catch (error) {
            alert('Error submitting reply');
        }
    };

    const hasUserReviewed = reviews.some(r => r.user?._id === user?.id);
    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    const StarRating = ({ rating, size = 'w-5 h-5', interactive = false, onChange }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size} ${interactive ? 'cursor-pointer' : ''} ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                    }`}
                    onClick={() => interactive && onChange?.(star)}
                />
            ))}
        </div>
    );

    const RatingBar = ({ rating, count, total }) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
            <div className="flex items-center gap-2 text-sm">
                <span className="w-8 text-gray-600">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-amber-400 rounded-full"
                    />
                </div>
                <span className="w-10 text-right text-gray-500">{count}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
                
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Overall Rating */}
                    <div className="text-center lg:text-left">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <StarRating rating={Math.round(stats.averageRating)} size="w-6 h-6" />
                        <p className="text-gray-500 mt-2">{stats.totalReviews} reviews</p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <RatingBar
                                key={rating}
                                rating={rating}
                                count={stats.distribution[rating] || 0}
                                total={stats.totalReviews}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Write Review Button */}
            {isEnrolled && !hasUserReviewed && !showWriteReview && (
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <button
                        onClick={() => setShowWriteReview(true)}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-5 h-5" />
                        Write a Review
                    </button>
                </div>
            )}

            {/* Review Form */}
            <AnimatePresence>
                {showWriteReview && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-gray-100 overflow-hidden"
                    >
                        <form onSubmit={handleSubmitReview} className="p-6 bg-gray-50 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {editingReview ? 'Edit Your Review' : 'Write Your Review'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowWriteReview(false);
                                        setEditingReview(null);
                                        setNewReview({ rating: 5, title: '', text: '' });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <StarRating
                                    rating={newReview.rating}
                                    size="w-8 h-8"
                                    interactive
                                    onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title (optional)</label>
                                <input
                                    type="text"
                                    value={newReview.title}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Summarize your review"
                                    maxLength={100}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={newReview.text}
                                    onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                                    placeholder="What did you like or dislike about this course?"
                                    rows={4}
                                    maxLength={1000}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                />
                                <p className="text-right text-sm text-gray-400 mt-1">
                                    {newReview.text.length}/1000
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                                >
                                    {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reviews List */}
            <div className="divide-y divide-gray-100">
                {displayedReviews.map((review) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6"
                    >
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                {review.user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {review.user?.name || 'Anonymous'}
                                            </h4>
                                            {review.verified && (
                                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <Check className="w-3 h-3" />
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StarRating rating={review.rating} size="w-4 h-4" />
                                            <span className="text-sm text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {review.user?._id === user?.id && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingReview(review);
                                                    setNewReview({
                                                        rating: review.rating,
                                                        title: review.title || '',
                                                        text: review.text
                                                    });
                                                    setShowWriteReview(true);
                                                }}
                                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {review.title && (
                                    <h5 className="font-semibold text-gray-800 mt-3">{review.title}</h5>
                                )}
                                <p className="text-gray-600 mt-2 leading-relaxed">{review.text}</p>

                                <div className="flex items-center gap-4 mt-4">
                                    <button
                                        onClick={() => handleHelpful(review._id)}
                                        className={`flex items-center gap-1.5 text-sm ${
                                            review.helpful?.includes(user?.id)
                                                ? 'text-indigo-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                        } transition-colors`}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Helpful ({review.helpful?.length || 0})
                                    </button>
                                    
                                    {isInstructor && !review.instructorReply && (
                                        <button
                                            onClick={() => setReplyingTo(review._id)}
                                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Reply
                                        </button>
                                    )}
                                </div>

                                {/* Instructor Reply */}
                                {review.instructorReply && (
                                    <div className="mt-4 ml-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-400">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="w-4 h-4 text-indigo-600" />
                                            <span className="font-semibold text-indigo-900">Instructor Response</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.instructorReply.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{review.instructorReply.text}</p>
                                    </div>
                                )}

                                {/* Reply Form */}
                                {replyingTo === review._id && (
                                    <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-xl">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your response..."
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleInstructorReply(review._id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                                            >
                                                Post Reply
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setReplyText('');
                                                }}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {reviews.length === 0 && (
                    <div className="p-12 text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>

            {/* Show More */}
            {reviews.length > 3 && (
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full py-3 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp className="w-5 h-5" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-5 h-5" />
                                Show All {reviews.length} Reviews
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseReviews;
