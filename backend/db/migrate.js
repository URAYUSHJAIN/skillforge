import { query } from './index.js';

// Add missing columns
const migrate = async () => {
  console.log('🔧 Running migrations...');

  try {
    // Add category column to courses
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General'
    `);
    console.log('✅ Added category column');

    // Add level column to courses
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'Beginner'
    `);
    console.log('✅ Added level column');

    // Add language column to courses
    await query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English'
    `);
    console.log('✅ Added language column');

    // Add description column to lectures
    await query(`
      ALTER TABLE lectures 
      ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''
    `);
    console.log('✅ Added lectures description column');

    // Add is_preview column to chapters
    await query(`
      ALTER TABLE chapters 
      ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false
    `);
    console.log('✅ Added is_preview column');

    console.log('🎉 Migrations complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
};

migrate();
