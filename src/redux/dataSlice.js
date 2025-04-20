import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setInstuctors(state, action) {
      state.instructors = action.payload;
    },
    setCourses(state, action) {
      state.courses = action.payload;
    },
    setLectures(state, action) {
      state.lectures = action.payload;
    },
  },
});

export const { setInstuctors, setCourses, setLectures } = dataSlice.actions;
export default dataSlice.reducer;
