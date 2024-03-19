import { io } from 'socket.io-client';
import apiSlice from '../api/apiSlice';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: (id) =>
				`/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=1&_limit=5`,

			async onCacheEntryAdded(
				arg,
				{ cacheDataLoaded, updateCachedData, cacheEntryRemoved }
			) {
				// create socket
				const socket = io('http://localhost:9000', {
					reconnectionDelay: 1000,
					reconnection: true,
					reconnectionAttemps: 10,
					transports: ['websocket'],
					agent: false,
					upgrade: false,
					rejectUnauthorized: false,
				});

				try {
					await cacheDataLoaded;
					socket.on('message', (data) => {
						const { data: message } = data;

						updateCachedData((draft) => {
							const matchedMessage = draft.find(
								(m) =>
									m.conversationId == message.conversationId
							);

							if (matchedMessage?.id) {
								draft.unshift(message);
							}
						});
					});
				} catch (error) {
					// do nothing
				}

				await cacheEntryRemoved;
				socket.close();
			},
		}),
		addMessage: builder.mutation({
			query: (data) => ({
				url: '/messages',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
