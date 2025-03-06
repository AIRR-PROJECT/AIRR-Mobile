import { configureStore, createSerializableStateInvariantMiddleware, Tuple } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";

// Ignore action path "payload.headers" to avoid "non-serializable" error
const serializableMiddleware = createSerializableStateInvariantMiddleware({
    ignoredActionPaths: ["payload.headers"]
  })

const store = configureStore({
    reducer: {
        // Add the reducer here
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serializableMiddleware)
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;