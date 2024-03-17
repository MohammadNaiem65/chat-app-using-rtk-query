import apiSlice from '../api/apiSlice';
import messagesApi from '../messages/messagesApi';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversations: builder.query({
			query: (email) =>
				`/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
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
				const { data } = await queryFulfilled;

				const { id, message, timestamp, users } = data || {};
				const receiver = users.find((user) => user.id !== sender.id);

				const messageDetails = {
					conversationId: id,
					sender,
					receiver,
					message,
					timestamp,
				};

				dispatch(
					messagesApi.endpoints.addMessage.initiate(messageDetails)
				);
			},
		}),
		editConversation: builder.mutation({
			query: ({ id, data }) => ({
				url: `/conversations/${id}`,
				method: 'PATCH',
				body: data,
			}),
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
