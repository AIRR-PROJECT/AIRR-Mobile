import { configureStore, createSerializableStateInvariantMiddleware, Tuple } from "@reduxjs/toolkit";

import loadingReducer from "./slices/loadingSlice";
import authReducer from "./slices/authSlice";
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import blogReducer from './slices/blogSlice';
import groupReducer from './slices/groupSlice';
import notifReducer from './slices/notifSlice';

// Ignore action paths to avoid "non-serializable" error
const serializableMiddleware = createSerializableStateInvariantMiddleware({
    ignoredActionPaths: ["payload.headers", "meta.arg", "payload.config.transformRequest.0"]
  })

const store = configureStore({
    reducer: {
        // Add the reducer here
        loading: loadingReducer,
        auth: authReducer,
        user: userReducer,
        feed: feedReducer,
        blog: blogReducer,
        group: groupReducer,
        notif: notifReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serializableMiddleware)
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;