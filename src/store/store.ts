import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use sessionStorage
import { combineReducers } from 'redux';
import loginReducer from './loginSlice.ts';
import userReducer from './userSlice.ts';
import myStudyGroupsReducer from './myStudyGroupsSlice.ts';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    login: loginReducer,
    user: userReducer,
    myStudyGroups: myStudyGroupsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store, persistor };