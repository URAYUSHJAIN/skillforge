import React, { useState } from 'react';

const API_BASE = 'http://localhost:4000';

const styles = {
  container: { padding: '6rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '2rem', fontSize: '1rem', color: '#475569' },
  header: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' },
  imageContainer: { borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  image: { width: '100%', height: '300px', objectFit: 'cover', backgroundColor: '#e2e8f0' },
  info: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  category: { display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#dbeafe', color: '#2563eb', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', width: 'fit-content' },
  title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' },
  teacher: { fontSize: '1.1rem', color: '#64748b' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#64748b' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  priceSection: { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
  price: { fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' },
  originalPrice: { fontSize: '1.25rem', color: '#94a3b8', textDecoration: 'line-through' },
  enrollBtn: { padding: '1rem 2rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' },
  section: { marginBottom: '2rem' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' },
  description: { color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' },
  lecturesList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  lecture: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' },
  lectureHeader: { padding: '1rem 1.5rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  lectureTitle: { fontWeight: '600', color: '#1e293b' },
  lectureToggle: { color: '#64748b', fontSize: '1.25rem' },
  chapters: { padding: '1rem 1.5rem' },
  chapter: { padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  chapterTitle: { color: '#475569' },
  chapterDuration: { color: '#94a3b8', fontSize: '0.9rem' },
};

const CourseDetailPageHome = ({ course, onBack }) => {
  const [expandedLectures, setExpandedLectures] = useState({});

  if (!course) {
    return (
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onBack}>← Back to Home</button>
        <p>Course not found</p>
      </div>
    );
  }

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  const getPrice = () => {
    if (course.isFree || course.pricingType === 'free') return 'Free';
    if (course.price?.sale) return `₹${course.price.sale}`;
    if (course.price?.original) return `₹${course.price.original}`;
    return 'Free';
  };

  const getDuration = () => {
    const h = course.totalDuration?.hours || 0;
    const m = course.totalDuration?.minutes || 0;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={onBack}>← Back to Home</button>
      
      <div style={styles.header}>
        <div style={styles.imageContainer}>
          <img 
            src={course.image ? `${API_BASE}${course.image}` : `https://source.unsplash.com/600x400/?${course.category || 'education'}`} 
            alt={course.name} 
            style={styles.image}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400'; }}
          />
        </div>
        <div style={styles.info}>
          <span style={styles.category}>{course.category || 'General'}</span>
          <h1 style={styles.title}>{course.name}</h1>
          <p style={styles.teacher}>by {course.teacher || 'Expert Instructor'}</p>
          <div style={styles.meta}>
            <span style={styles.metaItem}>⭐ {course.rating || course.avgRating || 4.5}</span>
            <span style={styles.metaItem}>📚 {course.totalLectures || course.lectures?.length || 0} lectures</span>
            <span style={styles.metaItem}>⏱️ {getDuration()}</span>
            <span style={styles.metaItem}>📊 {course.level || 'All Levels'}</span>
          </div>
          <div style={styles.priceSection}>
            <span style={styles.price}>{getPrice()}</span>
            {course.price?.original && course.price?.sale && (
              <span style={styles.originalPrice}>₹{course.price.original}</span>
            )}
          </div>
          <button style={styles.enrollBtn}>Enroll Now</button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>About This Course</h2>
        <p style={styles.description}>{course.description || course.overview || 'Learn valuable skills with this comprehensive course designed by industry experts.'}</p>
      </div>

      {course.lectures && course.lectures.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Course Content</h2>
          <div style={styles.lecturesList}>
            {course.lectures.map((lecture, i) => {
              const lectureId = lecture.id || lecture._id || i;
              const isExpanded = expandedLectures[lectureId];
              return (
                <div key={lectureId} style={styles.lecture}>
                  <div style={styles.lectureHeader} onClick={() => toggleLecture(lectureId)}>
                    <span style={styles.lectureTitle}>{lecture.title || `Lecture ${i + 1}`}</span>
                    <span style={styles.lectureToggle}>{isExpanded ? '▼' : '▶'}</span>
                  </div>
                  {isExpanded && lecture.chapters && (
                    <div style={styles.chapters}>
                      {lecture.chapters.map((chapter, j) => (
                        <div key={chapter.id || j} style={styles.chapter}>
                          <span style={styles.chapterTitle}>📖 {chapter.title || chapter.name || `Chapter ${j + 1}`}</span>
                          <span style={styles.chapterDuration}>
                            {chapter.durationMin ? `${chapter.durationMin}m` : 
                             chapter.duration ? `${chapter.duration.hours || 0}h ${chapter.duration.minutes || 0}m` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPageHome;
