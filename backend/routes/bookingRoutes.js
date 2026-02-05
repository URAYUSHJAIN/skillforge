import express from 'express';
import Stripe from 'stripe';
import { query } from '../db/index.js';

const router = express.Router();

// Initialize Stripe if key exists
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

// GET booking stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    // Total bookings
    const totalResult = await query('SELECT COUNT(*) as total FROM bookings');
    const total = parseInt(totalResult.rows[0].total) || 0;

    // Total revenue
    const revenueResult = await query(`
      SELECT COALESCE(SUM(course_price), 0) as revenue 
      FROM bookings 
      WHERE payment_status = 'Paid'
    `);
    const revenue = parseFloat(revenueResult.rows[0].revenue) || 0;

    // Recent bookings (last 7 days)
    const recentResult = await query(`
      SELECT COUNT(*) as recent 
      FROM bookings 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const recent = parseInt(recentResult.rows[0].recent) || 0;

    // Pending orders
    const pendingResult = await query(`
      SELECT COUNT(*) as pending 
      FROM bookings 
      WHERE order_status = 'Pending'
    `);
    const pending = parseInt(pendingResult.rows[0].pending) || 0;

    res.json({ 
      success: true, 
      stats: {
        totalBookings: total,
        totalRevenue: revenue,
        recentBookings: recent,
        pendingOrders: pending
      }
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all bookings
router.get('/list', async (req, res) => {
  try {
    const result = await query(`
      SELECT b.*, c.name as course_name, c.image as course_image
      FROM bookings b
      LEFT JOIN courses c ON c.id = b.course_id
      ORDER BY b.created_at DESC
    `);
    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET bookings by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(`
      SELECT b.*, c.name as course_name, c.image as course_image, c.teacher
      FROM bookings b
      LEFT JOIN courses c ON c.id = b.course_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);
    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET check enrollment status
router.get('/check/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const result = await query(`
      SELECT * FROM bookings 
      WHERE user_id = $1 AND course_id = $2 AND payment_status = 'Paid'
    `, [userId, courseId]);
    res.json({ 
      success: true, 
      isEnrolled: result.rows.length > 0,
      booking: result.rows[0] || null
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create booking (for free courses)
router.post('/enroll-free', async (req, res) => {
  try {
    const { userId, userEmail, userName, courseId } = req.body;

    // Get course details
    const courseResult = await query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const course = courseResult.rows[0];

    if (course.pricing_type !== 'free') {
      return res.status(400).json({ success: false, message: 'This course is not free' });
    }

    // Check if already enrolled
    const existingResult = await query(`
      SELECT * FROM bookings WHERE user_id = $1 AND course_id = $2
    `, [userId, courseId]);

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Already enrolled' });
    }

    // Create booking
    const result = await query(`
      INSERT INTO bookings (user_id, user_email, user_name, course_id, course_name, course_price, 
        payment_method, payment_status, order_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [userId, userEmail, userName, courseId, course.name, 0, 'Free', 'Paid', 'Confirmed']);

    res.status(201).json({ success: true, message: 'Enrolled successfully', booking: result.rows[0] });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create Stripe checkout session
router.post('/create-checkout', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ success: false, message: 'Stripe not configured' });
    }

    const { userId, userEmail, userName, courseId, successUrl, cancelUrl } = req.body;

    // Get course details
    const courseResult = await query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const course = courseResult.rows[0];
    const price = course.price_sale || course.price_original;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: course.name,
            description: course.overview?.substring(0, 200) || 'Course enrollment',
            images: course.image ? [`${process.env.API_BASE_URL}${course.image}`] : [],
          },
          unit_amount: Math.round(price * 100), // Convert to paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId,
        courseId: courseId.toString(),
        userName,
      },
    });

    // Create pending booking
    await query(`
      INSERT INTO bookings (user_id, user_email, user_name, course_id, course_name, course_price, 
        session_id, payment_status, order_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [userId, userEmail, userName, courseId, course.name, price, session.id, 'Unpaid', 'Pending']);

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST confirm payment (webhook or callback)
router.post('/confirm-payment', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!stripe) {
      return res.status(500).json({ success: false, message: 'Stripe not configured' });
    }

    // Verify session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update booking
      const result = await query(`
        UPDATE bookings SET 
          payment_status = 'Paid',
          order_status = 'Confirmed',
          payment_intent_id = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE session_id = $2
        RETURNING *
      `, [session.payment_intent, sessionId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.json({ success: true, message: 'Payment confirmed', booking: result.rows[0] });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE cancel booking
router.delete('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      UPDATE bookings SET 
        order_status = 'Cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
