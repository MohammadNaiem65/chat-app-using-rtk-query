import { useSelector } from 'react-redux';
import { useGetConversationsQuery } from '../../features/conversation/conversationApi';
import ChatItem from './ChatItem';
import Error from '../ui/Error';

export default function ChatItems() {
	const { user } = useSelector((state) => state.auth);

	const {
		data: conversations,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetConversationsQuery(user?.email);

	// decide what to render
	let content = null;

	if (isLoading) {
		content = <p className='m-2'>Loading...</p>;
	} else if (!isLoading && isError) {
		content = <Error message={error?.data} />;
	} else if (!isLoading && isSuccess && conversations.length === 0) {
		content = <li className='mx-4 my-2'>No conversation found.</li>;
	} else if (!isLoading && isSuccess && conversations.length > 0) {
		content = conversations.map((conversation) => (
			<li key={conversation?.id}>
				<ChatItem conversation={conversation} />
			</li>
		));
	}

	return <ul>{content}</ul>;
}
