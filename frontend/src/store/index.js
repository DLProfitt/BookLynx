import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookSlice';
import goalReducer from './goalSlice';
import readingReducer from './readingSlice';
import noteReducer from './noteSlice';
import emailReducer from './emailSlice';

const store = configureStore({
  reducer: {
    books: bookReducer,
    goals: goalReducer,
    reading: readingReducer,
    notes: noteReducer,
    email: emailReducer,
  },
});

export default store;
