import {
  combineReducers,
  configureStore,
  Middleware,
  isRejected,
} from '@reduxjs/toolkit';

import { userApi } from '@/stores/userStore/userStoreApi';
import { gpsApi } from '@/stores/gpsStore/gpsStoreApi';

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [gpsApi.reducerPath]: gpsApi.reducer,
});

// this function is for handling globally if rtk query response error
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    console.log(action);
  }

  return next(action);
};

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat([
        rtkQueryErrorLogger,
        userApi.middleware,
        gpsApi.middleware,
      ]),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
