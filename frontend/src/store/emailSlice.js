import { createSlice } from '@reduxjs/toolkit';

const emailSlice = createSlice({
  name: 'email',
  initialState: [],
  reducers: {
    setEmailSchedule(state, action) {
      return action.payload;
    },
    addEmailSchedule(state, action) {
      state.push(action.payload);
    },
    removeEmailSchedule(state, action) {
      return state.filter(email => email.id !== action.payload);
    }
  },
});

export const { setEmailSchedule, addEmailSchedule, removeEmailSchedule } = emailSlice.actions;
export default emailSlice.reducer;
