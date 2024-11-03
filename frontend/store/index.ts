// frontend/store/index.ts

import { configureStore } from "@reduxjs/toolkit";
import feedSlice from "./feedSlice";
// import authSlice from "./authSlice"; // Uncomment if auth is added

const store = configureStore({
  reducer: {
    feed: feedSlice,
    // auth: authSlice, // Uncomment if auth slice is added
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
