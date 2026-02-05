import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { query } from '../db/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

const router = express.Router();

// GET all courses (both /list and / for compatibility)
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM courses 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, courses: result.rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET public courses for frontend (with optional limit)
router.get('/public', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const result = await query(`
      SELECT * FROM courses 
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    res.json({ success: true, courses: result.rows });
  } catch (error) {
    console.error('Error fetching public courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM courses 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, courses: result.rows });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get course
    const courseResult = await query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const course = courseResult.rows[0];
    
    // Get lectures with chapters
    const lecturesResult = await query(`
      SELECT l.*, 
        COALESCE(json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name,
            'topic', c.topic,
            'video_url', c.video_url,
            'duration_hours', c.duration_hours,
            'duration_minutes', c.duration_minutes
          ) ORDER BY c.sort_order
        ) FILTER (WHERE c.id IS NOT NULL), '[]') as chapters
      FROM lectures l
      LEFT JOIN chapters c ON c.lecture_id = l.id
      WHERE l.course_id = $1
      GROUP BY l.id
      ORDER BY l.sort_order
    `, [id]);
    
    course.lectures = lecturesResult.rows;
    
    res.json({ success: true, course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET top/featured courses
router.get('/top/list', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM courses 
      WHERE course_type = 'top'
      ORDER BY avg_rating DESC, created_at DESC
      LIMIT 6
    `);
    res.json({ success: true, courses: result.rows });
  } catch (error) {
    console.error('Error fetching top courses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new course (root path - for admin panel)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Parse courseData from FormData (admin panel sends it this way)
    let courseData;
    if (req.body.courseData) {
      courseData = typeof req.body.courseData === 'string' 
        ? JSON.parse(req.body.courseData) 
        : req.body.courseData;
    } else {
      courseData = req.body;
    }

    const {
      name,
      description,
      teacher,
      category = 'General',
      level = 'Beginner',
      pricingType = 'free',
      originalPrice = 0,
      salePrice = 0,
      language = 'English',
      duration = { hours: 0, minutes: 0 },
      lectures = []
    } = courseData;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Calculate total duration from lectures if not provided
    let totalMinutes = (duration.hours || 0) * 60 + (duration.minutes || 0);
    let totalLectures = lectures.length;

    if (totalMinutes === 0 && lectures.length > 0) {
      lectures.forEach(lec => {
        if (lec.chapters) {
          lec.chapters.forEach(ch => {
            const durParts = (ch.duration || '0:0').split(':');
            totalMinutes += (parseInt(durParts[0]) || 0) * 60 + (parseInt(durParts[1]) || 0);
          });
        }
      });
    }

    // Insert course
    const courseResult = await query(`
      INSERT INTO courses (name, teacher, image, overview, pricing_type, price_original, price_sale, 
        total_duration_hours, total_duration_minutes, total_lectures, course_type, category, level, language)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      name, 
      teacher, 
      image, 
      description, 
      pricingType, 
      parseFloat(originalPrice) || 0, 
      parseFloat(salePrice) || 0,
      Math.floor(totalMinutes / 60), 
      totalMinutes % 60, 
      totalLectures, 
      'regular',
      category,
      level,
      language
    ]);

    const course = courseResult.rows[0];

    // Insert lectures and chapters
    for (let i = 0; i < lectures.length; i++) {
      const lec = lectures[i];
      const lecResult = await query(`
        INSERT INTO lectures (course_id, title, description, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [course.id, lec.title || 'Untitled', lec.description || '', i]);

      const lectureId = lecResult.rows[0].id;

      if (lec.chapters) {
        for (let j = 0; j < lec.chapters.length; j++) {
          const ch = lec.chapters[j];
          const durParts = (ch.duration || '0:0').split(':');
          await query(`
            INSERT INTO chapters (lecture_id, name, topic, video_url, duration_hours, duration_minutes, sort_order, is_preview)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            lectureId, 
            ch.title || '', 
            ch.title || '', 
            ch.videoUrl || '', 
            parseInt(durParts[0]) || 0, 
            parseInt(durParts[1]) || 0, 
            j,
            ch.isPreview || false
          ]);
        }
      }
    }

    res.status(201).json({ success: true, message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new course (legacy /add path)
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      teacher,
      overview,
      pricingType = 'free',
      priceOriginal = 0,
      priceSale = 0,
      courseType = 'regular',
      lectures = '[]'
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const parsedLectures = typeof lectures === 'string' ? JSON.parse(lectures) : lectures;

    // Calculate total duration
    let totalMinutes = 0;
    parsedLectures.forEach(lec => {
      if (lec.chapters) {
        lec.chapters.forEach(ch => {
          totalMinutes += (ch.duration_hours || 0) * 60 + (ch.duration_minutes || 0);
        });
      }
    });

    // Insert course
    const courseResult = await query(`
      INSERT INTO courses (name, teacher, image, overview, pricing_type, price_original, price_sale, 
        total_duration_hours, total_duration_minutes, total_lectures, course_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      name, teacher, image, overview, pricingType, priceOriginal, priceSale,
      Math.floor(totalMinutes / 60), totalMinutes % 60, parsedLectures.length, courseType
    ]);

    const course = courseResult.rows[0];

    // Insert lectures and chapters
    for (let i = 0; i < parsedLectures.length; i++) {
      const lec = parsedLectures[i];
      const lecResult = await query(`
        INSERT INTO lectures (course_id, title, sort_order)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [course.id, lec.title || 'Untitled', i]);

      const lectureId = lecResult.rows[0].id;

      if (lec.chapters) {
        for (let j = 0; j < lec.chapters.length; j++) {
          const ch = lec.chapters[j];
          await query(`
            INSERT INTO chapters (lecture_id, name, topic, video_url, duration_hours, duration_minutes, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [lectureId, ch.name, ch.topic, ch.video_url, ch.duration_hours || 0, ch.duration_minutes || 0, j]);
        }
      }
    }

    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update course
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      teacher,
      overview,
      pricingType,
      priceOriginal,
      priceSale,
      courseType
    } = req.body;

    let updateQuery = `
      UPDATE courses SET 
        name = COALESCE($1, name),
        teacher = COALESCE($2, teacher),
        overview = COALESCE($3, overview),
        pricing_type = COALESCE($4, pricing_type),
        price_original = COALESCE($5, price_original),
        price_sale = COALESCE($6, price_sale),
        course_type = COALESCE($7, course_type),
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [name, teacher, overview, pricingType, priceOriginal, priceSale, courseType];
    
    if (req.file) {
      updateQuery += `, image = $8`;
      params.push(`/uploads/${req.file.filename}`);
    }
    
    updateQuery += ` WHERE id = $${params.length + 1} RETURNING *`;
    params.push(id);

    const result = await query(updateQuery, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course updated', course: result.rows[0] });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE course
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add rating
router.post('/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment = '' } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({ success: false, message: 'userId and rating required' });
    }

    // Upsert rating
    await query(`
      INSERT INTO ratings (course_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (course_id, user_id) 
      DO UPDATE SET rating = $3, comment = $4, updated_at = CURRENT_TIMESTAMP
    `, [id, userId, rating, comment]);

    // Update course average rating
    const avgResult = await query(`
      SELECT AVG(rating) as avg, COUNT(*) as total FROM ratings WHERE course_id = $1
    `, [id]);

    await query(`
      UPDATE courses SET 
        avg_rating = $1, 
        total_ratings = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [avgResult.rows[0].avg || 0, avgResult.rows[0].total, id]);

    res.json({ success: true, message: 'Rating added' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET dashboard stats
router.get('/admin/dashboard', async (req, res) => {
  try {
    const coursesResult = await query('SELECT COUNT(*) as count FROM courses');
    const bookingsResult = await query('SELECT COUNT(*) as count FROM bookings');
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const revenueResult = await query(`
      SELECT COALESCE(SUM(course_price), 0) as total 
      FROM bookings WHERE payment_status = 'Paid'
    `);

    res.json({
      success: true,
      stats: {
        totalCourses: parseInt(coursesResult.rows[0].count),
        totalBookings: parseInt(bookingsResult.rows[0].count),
        totalUsers: parseInt(usersResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].total)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
