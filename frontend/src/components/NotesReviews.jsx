import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesReviews = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ user_id: '', book_id: '', note: '' });

  useEffect(() => {
    axios.get('/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/notes', newNote)
      .then(response => setNotes([...notes, newNote]))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Notes & Reviews</h1>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note.note}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="User ID" value={newNote.user_id} onChange={(e) => setNewNote({ ...newNote, user_id: e.target.value })} required />
        <input type="text" placeholder="Book ID" value={newNote.book_id} onChange={(e) => setNewNote({ ...newNote, book_id: e.target.value })} required />
        <textarea placeholder="Note" value={newNote.note} onChange={(e) => setNewNote({ ...newNote, note: e.target.value })} required />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NotesReviews;
