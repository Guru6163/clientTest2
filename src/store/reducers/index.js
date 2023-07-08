// store/reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer'; // Import your user reducer

const rootReducer = combineReducers({
  user: userReducer, // Add your reducers here
});

export default rootReducer;
