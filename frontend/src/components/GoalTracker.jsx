import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ user_id: '', book_id: '', goal: '' });

  useEffect(() => {
    axios.get('/api/goals')
      .then(response => setGoals(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/goals', newGoal)
      .then(response => setGoals([...goals, newGoal]))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Goal Tracker</h1>
      <ul>
        {goals.map((goal, index) => (
          <li key={index}>{goal.goal}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="User ID" value={newGoal.user_id} onChange={(e) => setNewGoal({ ...newGoal, user_id: e.target.value })} required />
        <input type="text" placeholder="Book ID" value={newGoal.book_id} onChange={(e) => setNewGoal({ ...newGoal, book_id: e.target.value })} required />
        <input type="text" placeholder="Goal" value={newGoal.goal} onChange={(e) => setNewGoal({ ...newGoal, goal: e.target.value })} required />
        <button type="submit">Add Goal</button>
      </form>
    </div>
  );
};

export default GoalTracker;
