import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
  name: 'books',
  initialState: [],
  reducers: {
    setBooks(state, action) {
      return action.payload; // Redux Toolkit uses Immer, allowing direct state mutations
    },
    addBook(state, action) {
      state.push(action.payload);
    },
    removeBook(state, action) {
      return state.filter(book => book.id !== action.payload);
    }
  },
});

export const { setBooks, addBook, removeBook } = bookSlice.actions;
export default bookSlice.reducer;
