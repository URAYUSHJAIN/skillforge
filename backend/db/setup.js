import { query } from './index.js';

// Create all tables
const setupDatabase = async () => {
  console.log('🔧 Setting up database tables...');

  try {
    // Users table (for Neon Auth or custom auth)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        avatar_url TEXT,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Courses table
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        teacher VARCHAR(255) NOT NULL,
        image TEXT,
        overview TEXT,
        pricing_type VARCHAR(50) DEFAULT 'free',
        price_original DECIMAL(10,2) DEFAULT 0,
        price_sale DECIMAL(10,2) DEFAULT 0,
        avg_rating DECIMAL(3,2) DEFAULT 0,
        total_ratings INTEGER DEFAULT 0,
        total_duration_hours INTEGER DEFAULT 0,
        total_duration_minutes INTEGER DEFAULT 0,
        total_lectures INTEGER DEFAULT 0,
        course_type VARCHAR(50) DEFAULT 'regular',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table ready');

    // Lectures table
    await query(`
      CREATE TABLE IF NOT EXISTS lectures (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        duration_hours INTEGER DEFAULT 0,
        duration_minutes INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Lectures table ready');

    // Chapters table
    await query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id SERIAL PRIMARY KEY,
        lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
        name VARCHAR(255),
        topic TEXT,
        video_url TEXT,
        duration_hours INTEGER DEFAULT 0,
        duration_minutes INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Chapters table ready');

    // Ratings table
    await query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(course_id, user_id)
      )
    `);
    console.log('✅ Ratings table ready');

    // Bookings/Enrollments table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_email VARCHAR(255),
        user_name VARCHAR(255),
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        course_name VARCHAR(255),
        course_price DECIMAL(10,2) DEFAULT 0,
        payment_method VARCHAR(50) DEFAULT 'Online',
        payment_status VARCHAR(50) DEFAULT 'Unpaid',
        payment_intent_id VARCHAR(255),
        session_id VARCHAR(255),
        order_status VARCHAR(50) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Bookings table ready');

    // Contacts table for contact form submissions
    await query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table ready');

    // Create indexes for better performance
    await query(`CREATE INDEX IF NOT EXISTS idx_courses_type ON courses(course_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_bookings_course ON bookings(course_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_lectures_course ON lectures(course_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_chapters_lecture ON chapters(lecture_id)`);
    console.log('✅ Indexes created');

    console.log('\n🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run if called directly
setupDatabase().then(() => process.exit(0));

export default setupDatabase;
