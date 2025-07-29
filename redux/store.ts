import { configureStore, createSerializableStateInvariantMiddleware, Tuple } from "@reduxjs/toolkit";

import loadingReducer from "./slices/loadingSlice";
import authReducer from "./slices/authSlice";
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import blogReducer from './slices/blogSlice';
import groupReducer from './slices/groupSlice';
import notifReducer from './slices/notifSlice';
import careerPathReducer from './slices/careerPathSlice';

// Ignore action paths to avoid "non-serializable" error
const serializableMiddleware = createSerializableStateInvariantMiddleware({
    ignoredActionPaths: [
        "payload.headers",
        "payload.request",
        "meta.arg",
        "payload.config.transformRequest.0",
        "payload.config.transformResponse.0",
        "payload.config.env.FormData",
        "payload.config.env.Blob",
        "payload.config.validateStatus",
        "payload.config.headers",
        "payload.config.signal"
    ]
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
        notif: notifReducer,
        careerPath: careerPathReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serializableMiddleware)
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;