import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";

const store = configureStore({
    reducer: {
        // Add the reducer here
        auth: authReducer,
    },
});

export default store;