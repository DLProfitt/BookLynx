import { createSlice } from '@reduxjs/toolkit';

const readingSlice = createSlice({
  name: 'reading',
  initialState: [],
  reducers: {
    setReadingData(state, action) {
      return action.payload;
    },
    addReadingData(state, action) {
      state.push(action.payload);
    },
    removeReadingData(state, action) {
      return state.filter(reading => reading.id !== action.payload);
    }
  },
});

export const { setReadingData, addReadingData, removeReadingData } = readingSlice.actions;
export default readingSlice.reducer;
