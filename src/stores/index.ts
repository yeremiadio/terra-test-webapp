import {
  combineReducers,
  configureStore,
  Middleware,
  isRejected,
} from '@reduxjs/toolkit';

import { userApi } from '@/stores/userStore/userStoreApi';

const rootReducer = combineReducers({ [userApi.reducerPath]: userApi.reducer });

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
      getDefaultMiddleware().concat([rtkQueryErrorLogger, userApi.middleware]),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
