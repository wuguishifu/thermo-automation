import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { automationsApi } from '@/api/automationsApiSlice';
import { devicesApi } from '@/api/devicesApiSlice';
import { reduxLocalStorage } from '@/state/local-storage';
import { settingsSlice } from '@/state/settingsSlice';

const rootReducer = combineReducers({
  [settingsSlice.name]: settingsSlice.reducer,
  [devicesApi.reducerPath]: devicesApi.reducer,
  [automationsApi.reducerPath]: automationsApi.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: reduxLocalStorage,
  whitelist: [settingsSlice.name],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([devicesApi.middleware, automationsApi.middleware]),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
