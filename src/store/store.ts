import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use sessionStorage
import { combineReducers } from 'redux'; // Import combineReducers
import loginReducer from './loginSlice.ts';
import userReducer from './userSlice.ts';

// Create a persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Combine your reducers
const rootReducer = combineReducers({
    login: loginReducer,
    user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,
});

// Create a persistor
const persistor = persistStore(store);

export { store, persistor };