import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

// POST /api/contact - Submit a contact form message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Insert contact message
    const result = await query(
      `INSERT INTO contacts (name, email, subject, message, status)
       VALUES ($1, $2, $3, $4, 'new')
       RETURNING *`,
      [name, email, subject || '', message]
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again later.'
    });
  }
});

// GET /api/contact/list - Get all contact messages (Admin only)
router.get('/list', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let queryText = 'SELECT * FROM contacts';
    const params = [];

    if (status && status !== 'all') {
      queryText += ' WHERE status = $1';
      params.push(status);
    }

    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM contacts';
    if (status && status !== 'all') {
      countQuery += ' WHERE status = $1';
    }
    const countResult = await query(countQuery, status && status !== 'all' ? [status] : []);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      contacts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// GET /api/contact/stats - Get contact stats (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'read') as read_count,
        COUNT(*) FILTER (WHERE status = 'replied') as replied_count,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count
      FROM contacts
    `);

    res.json({
      success: true,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

// PUT /api/contact/:id - Update contact status (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updates = [];
    const params = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }
    if (admin_notes !== undefined) {
      updates.push(`admin_notes = $${paramCount++}`);
      params.push(admin_notes);
    }
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await query(
      `UPDATE contacts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// DELETE /api/contact/:id - Delete a contact message (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM contacts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

export default router;
