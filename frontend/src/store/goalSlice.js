import { createSlice } from '@reduxjs/toolkit';

const goalSlice = createSlice({
  name: 'goals',
  initialState: [],
  reducers: {
    setGoals(state, action) {
      return action.payload;
    },
    addGoal(state, action) {
      state.push(action.payload);
    },
    removeGoal(state, action) {
      return state.filter(goal => goal.id !== action.payload);
    }
  },
});

export const { setGoals, addGoal, removeGoal } = goalSlice.actions;
export default goalSlice.reducer;
