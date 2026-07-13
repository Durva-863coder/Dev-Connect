import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import projectReducer from './projectSlice';
import connectionReducer from './connectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profiles: profileReducer,
    projects: projectReducer,
    connections: connectionReducer,
  },
});
