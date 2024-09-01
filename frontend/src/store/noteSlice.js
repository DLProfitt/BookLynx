import { createSlice } from '@reduxjs/toolkit';

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    setNotes(state, action) {
      return action.payload;
    },
    addNote(state, action) {
      state.push(action.payload);
    },
    removeNote(state, action) {
      return state.filter(note => note.id !== action.payload);
    }
  },
});

export const { setNotes, addNote, removeNote } = noteSlice.actions;
export default noteSlice.reducer;
