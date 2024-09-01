import React, { useState } from 'react';
import axios from 'axios';

const ScheduleEmail = () => {
  const [email, setEmail] = useState('');
  const [schedule, setSchedule] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/schedule', { email, userId, scheduleExpression: schedule })
      .then(response => alert('Email schedule set'))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Schedule Email</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        <input type="text" placeholder="Schedule Expression (cron format)" value={schedule} onChange={(e) => setSchedule(e.target.value)} required />
        <button type="submit">Set Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleEmail;
