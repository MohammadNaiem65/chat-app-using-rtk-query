import { io } from 'socket.io-client';

import apiSlice from '../api/apiSlice';
import messagesApi from '../messages/messagesApi';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversations: builder.query({
			query: (email) =>
				`/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
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

					socket.on('conversation', (data) => {
						updateCachedData((draft) => {
							const conversation = draft.find(
								(conversation) =>
									conversation.id == data?.data?.id
							);

							if (conversation?.id) {
								conversation.message = data?.data?.message;
								conversation.timestamp = data?.data?.timestamp;
							}
						});
					});
				} catch (err) {
					// do nothing
				}

				await cacheEntryRemoved;
				socket.close();
			},
		}),
		getConversation: builder.query({
			query: ({ userEmail, partnerEmail }) =>
				`/conversations?participants_like=${userEmail}-${partnerEmail}&&participants_like=${partnerEmail}-${userEmail}`,
		}),

		addConversation: builder.mutation({
			query: ({ data }) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),

			async onQueryStarted({ sender }, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;

					const { id, message, timestamp, users } = data || {};
					const receiver = users.find(
						(user) => user.id !== sender.id
					);

					const messageDetails = {
						conversationId: id,
						sender,
						receiver,
						message,
						timestamp,
					};

					dispatch(
						messagesApi.endpoints.addMessage.initiate(
							messageDetails
						)
					)
						// pessimistic cache update
						.then((res) => {
							// cache new conversation
							dispatch(
								apiSlice.util.updateQueryData(
									'getConversations',
									sender.email,
									(draft) => {
										draft.unshift(data);
									}
								)
							);

							// cache new message
							dispatch(
								apiSlice.util.upsertQueryData(
									'getMessages',
									id.toString(),
									[res.data]
								)
							);
						});
				} catch (err) {
					// Handle error
				}
			},
		}),

		editConversation: builder.mutation({
			query: ({ id, data }) => ({
				url: `/conversations/${id}`,
				method: 'PATCH',
				body: data,
			}),

			async onQueryStarted(
				{ id, sender, data },
				{ queryFulfilled, dispatch }
			) {
				// optimistic cache update start
				const patchResult = dispatch(
					apiSlice.util.updateQueryData(
						'getConversations',
						sender.email,
						(draft) => {
							const conversationToEdit = draft.find(
								(conversation) => conversation.id == id
							);

							conversationToEdit.message = data.message;
							conversationToEdit.timestamp = data.timestamp;
						}
					)
				);
				// optimistic cache update end

				try {
					const { data } = await queryFulfilled;

					const { message, timestamp, users } = data || {};
					const receiver = users.find(
						(user) => user.id !== sender.id
					);

					const messageDetails = {
						conversationId: id,
						sender,
						receiver,
						message,
						timestamp,
					};

					const res = await dispatch(
						messagesApi.endpoints.addMessage.initiate(
							messageDetails
						)
					).unwrap();

					// pessimistic cache update of messages
					dispatch(
						apiSlice.util.updateQueryData(
							'getMessages',
							id.toString(),
							(draft) => {
								draft.unshift(res);
							}
						)
					);
				} catch (error) {
					patchResult.undo();
				}
			},
		}),
	}),
});

export default conversationApi;
export const {
	useGetConversationsQuery,
	useGetConversationQuery,
	useAddConversationMutation,
	useEditConversationMutation,
} = conversationApi;
