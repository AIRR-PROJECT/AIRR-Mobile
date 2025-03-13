import { configureStore, createSerializableStateInvariantMiddleware, Tuple } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';

// Ignore action path "payload.headers" to avoid "non-serializable" error
const serializableMiddleware = createSerializableStateInvariantMiddleware({
    ignoredActionPaths: ["payload.headers"]
  })

const store = configureStore({
    reducer: {
        // Add the reducer here
        auth: authReducer,
        user: userReducer,
        feed: feedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serializableMiddleware)
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;