import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contact/list?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contact/stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
        fetchStats();
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteContact = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/contact/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchContacts();
        fetchStats();
        setSelectedContact(null);
      }
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return { bg: '#fee2e2', text: '#dc2626' };
      case 'read': return { bg: '#fef3c7', text: '#d97706' };
      case 'replied': return { bg: '#dbeafe', text: '#2563eb' };
      case 'resolved': return { bg: '#dcfce7', text: '#16a34a' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#fff'
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  };

  const statCardStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#94a3b8'
  };

  const filterContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  };

  const filterButtonStyle = (active) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? '#3b82f6' : '#334155',
    color: active ? '#fff' : '#94a3b8',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  });

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  };

  const listContainerStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    overflow: 'hidden'
  };

  const listItemStyle = (isSelected) => ({
    padding: '16px',
    borderBottom: '1px solid #334155',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#334155' : 'transparent',
    transition: 'background-color 0.2s'
  });

  const detailContainerStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px'
  };

  const statusBadgeStyle = (status) => {
    const colors = getStatusColor(status);
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: colors.bg,
      color: colors.text,
      textTransform: 'capitalize'
    };
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '8px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Contact Messages</h1>
        <p style={{ color: '#94a3b8' }}>Manage messages from your contact form</p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <div style={{ ...statValueStyle, color: '#fff' }}>{stats.total}</div>
            <div style={statLabelStyle}>Total</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statValueStyle, color: '#ef4444' }}>{stats.new_count}</div>
            <div style={statLabelStyle}>New</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statValueStyle, color: '#f59e0b' }}>{stats.read_count}</div>
            <div style={statLabelStyle}>Read</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statValueStyle, color: '#3b82f6' }}>{stats.replied_count}</div>
            <div style={statLabelStyle}>Replied</div>
          </div>
          <div style={statCardStyle}>
            <div style={{ ...statValueStyle, color: '#22c55e' }}>{stats.resolved_count}</div>
            <div style={statLabelStyle}>Resolved</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={filterContainerStyle}>
        {['all', 'new', 'read', 'replied', 'resolved'].map(status => (
          <button
            key={status}
            style={filterButtonStyle(statusFilter === status)}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#7f1d1d', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={contentGridStyle}>
        {/* List */}
        <div style={listContainerStyle}>
          {contacts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              No messages found
            </div>
          ) : (
            contacts.map(contact => (
              <div
                key={contact.id}
                style={listItemStyle(selectedContact?.id === contact.id)}
                onClick={() => setSelectedContact(contact)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{contact.name}</div>
                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>{contact.email}</div>
                  </div>
                  <span style={statusBadgeStyle(contact.status)}>{contact.status}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                  {contact.subject || 'No subject'}
                </div>
                <div style={{ fontSize: '12px', color: '#475569' }}>
                  {formatDate(contact.created_at)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div style={detailContainerStyle}>
          {selectedContact ? (
            <>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                      {selectedContact.name}
                    </h2>
                    <a href={`mailto:${selectedContact.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {selectedContact.email}
                    </a>
                  </div>
                  <span style={statusBadgeStyle(selectedContact.status)}>{selectedContact.status}</span>
                </div>
                <div style={{ marginTop: '8px', color: '#64748b', fontSize: '14px' }}>
                  {formatDate(selectedContact.created_at)}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#94a3b8' }}>Subject</div>
                <div>{selectedContact.subject || 'No subject'}</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#94a3b8' }}>Message</div>
                <div style={{ 
                  backgroundColor: '#0f172a', 
                  padding: '16px', 
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedContact.message}
                </div>
              </div>

              {/* Actions */}
              <div style={{ borderTop: '1px solid #334155', paddingTop: '16px' }}>
                <div style={{ fontWeight: '600', marginBottom: '12px', color: '#94a3b8' }}>Update Status</div>
                <div style={{ marginBottom: '16px' }}>
                  {['new', 'read', 'replied', 'resolved'].map(status => (
                    <button
                      key={status}
                      style={{
                        ...buttonStyle,
                        backgroundColor: selectedContact.status === status ? '#3b82f6' : '#334155',
                        color: selectedContact.status === status ? '#fff' : '#94a3b8'
                      }}
                      onClick={() => updateContactStatus(selectedContact.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    Reply via Email
                  </a>
                  <button
                    style={{ ...buttonStyle, backgroundColor: '#dc2626', color: '#fff' }}
                    onClick={() => deleteContact(selectedContact.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <div>Select a message to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
