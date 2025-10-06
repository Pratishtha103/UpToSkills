import React, { useState } from 'react';

const adminNotificationsData = [
  {
    id: 1,
    title: 'New Assignment Added',
    message: 'Your instructor has added a new assignment for the Physics course.',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'New Message from Jane Cooper',
    message: "Hey, how's your project going? Let me know if you need help.",
    time: '1 day ago',
  },
  {
    id: 3,
    title: 'Milestone Completed',
    message: 'Congratulations! You have completed the "Initial Research" milestone.',
    time: '3 days ago',
  },
  {
    id: 4,
    title: 'Upcoming Deadline',
    message: 'The deadline for "Complete Problem Set #5" is tomorrow.',
    time: '5 days ago',
  },
];

const styles = {
  container: {
    padding: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'box-shadow 0.2s ease-in-out',
    cursor: 'default',
  },
  itemHover: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 4px 0',
  },
  message: {
    fontSize: '14px',
    color: '#4b5563',
    margin: 0,
  },
  time: {
    fontSize: '12px',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    marginLeft: '16px',
    flexShrink: 0,
  },
};

const AdminNotifications = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={styles.container}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>Notification</h2>
      <div style={styles.list}>
        {adminNotificationsData.map((notification) => (
          <div
            key={notification.id}
            style={{
              ...styles.item,
              ...(hoveredId === notification.id ? styles.itemHover : {}),
            }}
            onMouseEnter={() => setHoveredId(notification.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={styles.content}>
              <h3 style={styles.title}>{notification.title}</h3>
              <p style={styles.message}>{notification.message}</p>
            </div>
            <span style={styles.time}>{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
