const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

// @desc    Create Razorpay order
// @route   POST /api/payments/order
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: 'Payment gateway is not configured yet.',
            });
        }

        const options = {
            amount: course.price * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Create enrollment
            await Enrollment.create({
                user: req.user.id,
                course: courseId,
                paymentStatus: 'paid',
                razorpayOrderId: razorpay_order_id,
            });

            // Update course student count
            await Course.findByIdAndUpdate(courseId, {
                $inc: { studentsEnrolled: 1 }
            });

            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }
    } catch (error) {
        next(error);
    }
};
