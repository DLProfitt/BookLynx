import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const ReadingData = () => {
  const [readingData, setReadingData] = useState([]);
  const [newReading, setNewReading] = useState({ user_id: '', book_id: '', pages_read: '', timestamp: moment().format() });

  useEffect(() => {
    axios.get('/api/reading')
      .then(response => setReadingData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/reading', newReading)
      .then(response => setReadingData([...readingData, newReading]))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Reading Data</h1>
      <ul>
        {readingData.map((reading, index) => (
          <li key={index}>{reading.pages_read} pages read on {moment(reading.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="User ID" value={newReading.user_id} onChange={(e) => setNewReading({ ...newReading, user_id: e.target.value })} required />
        <input type="text" placeholder="Book ID" value={newReading.book_id} onChange={(e) => setNewReading({ ...newReading, book_id: e.target.value })} required />
        <input type="number" placeholder="Pages Read" value={newReading.pages_read} onChange={(e) => setNewReading({ ...newReading, pages_read: e.target.value })} required />
        <button type="submit">Add Reading Data</button>
      </form>
    </div>
  );
};

export default ReadingData;
