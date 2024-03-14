import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	accessToken: null,
	user: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		userLoggedIn: (state, action) => {
			state.user = action.payload?.user;
			state.accessToken = action.payload?.accessToken;
		},
		userLoggedOut: (state) => {
			state.user = null;
			state.accessToken = null;
		},
	},
});

export default authSlice.reducer;
export const { userLoggedIn, userLoggedOut } = authSlice.actions;
