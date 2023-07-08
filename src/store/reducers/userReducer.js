// store/reducers/userReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setLatitude: (state, action) => {
      state.latitude = action.payload;
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload;
    },
  },
});

export const { setName, setAddress, setLatitude, setLongitude } = userSlice.actions;
export default userSlice.reducer;
