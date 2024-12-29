import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    selectedFilters: {
      Categories: [],
      price: { minPrice: 0, maxPrice: 0 },
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.selectedFilters = action.payload;
    },
    resetFilters: (state) => {
      state.selectedFilters = {
        Categories: [],
        price: { minPrice: 0, maxPrice: 0 },
      };
    },
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;