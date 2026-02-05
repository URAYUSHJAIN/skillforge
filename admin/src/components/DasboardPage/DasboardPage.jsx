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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  coursesSection: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
  },
  coursesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  courseImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    backgroundColor: '#e2e8f0',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem',
  },
  courseTeacher: {
    fontSize: '0.9rem',
    color: '#64748b',
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
};

const DasboardPage = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesRes = await fetch(`${API_BASE}/api/course`);
        const coursesData = await coursesRes.json();
        
        if (coursesData.success) {
          setCourses(coursesData.courses || []);
          setStats(prev => ({ ...prev, totalCourses: (coursesData.courses || []).length }));
        }

        // Fetch booking stats
        try {
          const statsRes = await fetch(`${API_BASE}/api/booking/stats`);
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(prev => ({
              ...prev,
              totalBookings: statsData.stats?.totalBookings || 0,
              totalRevenue: statsData.stats?.totalRevenue || 0,
            }));
          }
        } catch (e) {
          console.log('Stats not available yet');
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Courses', value: stats.totalCourses, icon: '📚', color: '#3b82f6' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: '#10b981' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: '#f59e0b' },
    { label: 'Active Students', value: stats.totalBookings, icon: '👥', color: '#8b5cf6' },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>
      
      <div style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div style={styles.statInfo}>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statValue}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.coursesSection}>
        <h2 style={styles.sectionTitle}>Recent Courses</h2>
        <div style={styles.coursesList}>
          {courses.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No courses yet. Add your first course!</p>
          ) : (
            courses.slice(0, 5).map((course) => (
              <div key={course._id || course.id} style={styles.courseItem}>
                <img 
                  src={course.image ? `${API_BASE}${course.image}` : 'https://via.placeholder.com/60'} 
                  alt={course.name}
                  style={styles.courseImage}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                />
                <div style={styles.courseInfo}>
                  <div style={styles.courseName}>{course.name || 'Untitled Course'}</div>
                  <div style={styles.courseTeacher}>by {course.teacher || 'Unknown'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DasboardPage;
