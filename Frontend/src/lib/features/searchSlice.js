import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  aiMatchedHotels: [],
  aiFilters: {
    priceRange: { min: null, max: null },
    location: null,
    amenities: [],
    rating: null,
    keywords: []
  },
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setAiMatchedHotels: (state, action) => {
      state.aiMatchedHotels = Array.isArray(action.payload) ? action.payload : [];
    },
    clearAiMatchedHotels: (state) => {
      state.aiMatchedHotels = [];
    },
    setAiFilters: (state, action) => {
      state.aiFilters = { ...state.aiFilters, ...action.payload };
    },
    clearAiFilters: (state) => {
      state.aiFilters = {
        priceRange: { min: null, max: null },
        location: null,
        amenities: [],
        rating: null,
        keywords: []
      };
    },
    resetQuery: (state) => {
      state.query = "";
    },
    clearSearch: (state) => {
      state.query = "";
      state.aiMatchedHotels = [];
      state.aiFilters = {
        priceRange: { min: null, max: null },
        location: null,
        amenities: [],
        rating: null,
        keywords: []
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setQuery, resetQuery, setAiMatchedHotels, clearAiMatchedHotels, setAiFilters, clearAiFilters, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;