import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 导入taskSlice
import taskReducer from './taskSlice';

// 配置持久化存储
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks'] // 只持久化tasks部分的状态
};

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, taskReducer);

// 创建Redux store
export const store = configureStore({
  reducer: {
    tasks: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 创建persistor
export const persistor = persistStore(store);