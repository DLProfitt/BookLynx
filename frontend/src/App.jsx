import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import BookList from './components/BookList';
import GoalTracker from './components/GoalTracker';
import ReadingData from './components/ReadingData';
import NotesReviews from './components/NotesReviews';
import ScheduleEmail from './components/ScheduleEmail';

const App = () => (
  <Router>
    <nav>
      <ul>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/goals">Goals</Link></li>
        <li><Link to="/reading">Reading Data</Link></li>
        <li><Link to="/notes">Notes & Reviews</Link></li>
        <li><Link to="/schedule">Schedule Email</Link></li>
      </ul>
    </nav>
    <Switch>
      <Route path="/books" component={BookList} />
      <Route path="/goals" component={GoalTracker} />
      <Route path="/reading" component={ReadingData} />
      <Route path="/notes" component={NotesReviews} />
      <Route path="/schedule" component={ScheduleEmail} />
    </Switch>
  </Router>
);

export default App;
