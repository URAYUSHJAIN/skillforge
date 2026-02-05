import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:4000';

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    marginTop: '80px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#1e293b',
  },
  searchBox: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    backgroundColor: '#e2e8f0',
  },
  cardContent: {
    padding: '1rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  cardTeacher: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '0.5rem',
  },
  cardPrice: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: '0.5rem',
  },
  cardMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#64748b',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #f1f5f9',
  },
  btn: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  btnEdit: {
    backgroundColor: '#3b82f6',
    color: '#fff',
  },
  btnDelete: {
    backgroundColor: '#ef4444',
    color: '#fff',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ef4444',
  },
  lecturesSection: {
    padding: '0 1rem 1rem',
    borderTop: '1px solid #f1f5f9',
  },
  lectureItem: {
    padding: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#475569',
    borderBottom: '1px solid #f1f5f9',
  },
};

const ListPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/course`);
      const data = await res.json();
      
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setCourses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch courses error:', err);
      setError('Failed to load courses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/course/${courseId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setCourses(courses.filter(c => (c._id || c.id) !== courseId));
        alert('Course deleted successfully');
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting course');
    }
  };

  const filteredCourses = courses.filter(course => 
    (course.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.teacher || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrice = (course) => {
    if (course.pricingType === 'free') return 'Free';
    if (course.price?.sale) return `₹${course.price.sale}`;
    if (course.price?.original) return `₹${course.price.original}`;
    return 'Free';
  };

  const getDuration = (course) => {
    const hours = course.totalDuration?.hours || 0;
    const minutes = course.totalDuration?.minutes || 0;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Courses</h1>
        <div style={styles.loading}>Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Courses</h1>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Courses ({courses.length})</h1>
      
      <input
        type="text"
        placeholder="Search courses by name or teacher..."
        style={styles.searchBox}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredCourses.length === 0 ? (
        <div style={styles.loading}>No courses found. Add your first course!</div>
      ) : (
        <div style={styles.grid}>
          {filteredCourses.map((course) => {
            const courseId = course._id || course.id;
            const isExpanded = expandedCourse === courseId;
            
            return (
              <div key={courseId} style={styles.card}>
                <img 
                  src={course.image ? `${API_BASE}${course.image}` : 'https://via.placeholder.com/300x160'}
                  alt={course.name}
                  style={styles.cardImage}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160'; }}
                />
                <div style={styles.cardContent}>
                  <div style={styles.cardTitle}>{course.name || 'Untitled Course'}</div>
                  <div style={styles.cardTeacher}>by {course.teacher || 'Unknown'}</div>
                  <div style={styles.cardPrice}>{getPrice(course)}</div>
                  <div style={styles.cardMeta}>
                    <span>📚 {course.totalLectures || 0} lectures</span>
                    <span>⏱️ {getDuration(course)}</span>
                    <span>⭐ {course.avgRating || 0}</span>
                  </div>
                </div>
                
                {course.lectures && course.lectures.length > 0 && (
                  <div style={styles.lecturesSection}>
                    <button
                      onClick={() => setExpandedCourse(isExpanded ? null : courseId)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.5rem 0' }}
                    >
                      {isExpanded ? '▼ Hide Lectures' : '▶ Show Lectures'}
                    </button>
                    {isExpanded && (
                      <div>
                        {course.lectures.map((lecture, idx) => (
                          <div key={idx} style={styles.lectureItem}>
                            📖 {lecture.title || `Lecture ${idx + 1}`}
                            {lecture.chapters && lecture.chapters.length > 0 && (
                              <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>
                                ({lecture.chapters.length} chapters)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div style={styles.cardActions}>
                  <button style={{ ...styles.btn, ...styles.btnDelete }} onClick={() => handleDelete(courseId)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListPage;
