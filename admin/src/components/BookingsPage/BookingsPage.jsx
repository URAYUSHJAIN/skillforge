import React, { useState, useEffect, useRef } from 'react';

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
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    color: '#1e293b',
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
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  badgePaid: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  badgeUnpaid: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const fetchBookings = async (search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('limit', '100');
      
      const res = await fetch(`${API_BASE}/api/booking?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBookings(searchTerm);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Bookings</h1>
        <div style={styles.loading}>Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Bookings</h1>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bookings</h1>
      
      <input
        type="text"
        placeholder="Search bookings by student name or course..."
        style={styles.searchBox}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {bookings.length === 0 ? (
        <div style={styles.loading}>No bookings found.</div>
      ) : (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Teacher</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id || booking.bookingId || index}>
                <td style={styles.td}>{booking.studentName || 'Unknown'}</td>
                <td style={styles.td}>{booking.courseName || 'Unknown'}</td>
                <td style={styles.td}>{booking.teacherName || 'Unknown'}</td>
                <td style={styles.td}>₹{booking.price || 0}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    ...(booking.paymentStatus === 'Paid' ? styles.badgePaid : styles.badgeUnpaid),
                  }}>
                    {booking.paymentStatus || 'Unpaid'}
                  </span>
                </td>
                <td style={styles.td}>
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsPage;

