import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shiftPlan: [],
};

const supervisorSlice = createSlice({
  name: "supervisor",
  initialState,
  reducers: {
    setShiftPlan: (state, action) => {
      state.shiftPlan = action.payload;
    },
  },
});

export const { setShiftPlan } = supervisorSlice.actions;
export default supervisorSlice.reducer;
