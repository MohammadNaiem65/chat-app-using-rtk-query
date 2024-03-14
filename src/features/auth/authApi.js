import apiSlice from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: '/register',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;

					// save auth credential to local storage
					localStorage.setItem('auth', JSON.stringify(data));

					// save auth credential to redux store
					dispatch(userLoggedIn(data));
				} catch (error) {
					// handle error in the UI
				}
			},
		}),
		login: builder.mutation({
			query: (data) => ({
				url: '/login',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;

					// save auth credential to local storage
					localStorage.setItem('auth', JSON.stringify(data));

					// save auth credential to redux store
					dispatch(userLoggedIn(data));
				} catch (error) {
					// handle error in the UI
				}
			},
		}),
	}),
});

export default authApi;
export const { useRegisterMutation, useLoginMutation } = authApi;
