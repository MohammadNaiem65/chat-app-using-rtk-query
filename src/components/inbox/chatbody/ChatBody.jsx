import { useParams } from 'react-router-dom';

import { useGetMessagesQuery } from '../../../features/messages/messagesApi';
import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';
import Error from '../../ui/Error';

export default function ChatBody() {
	const { id } = useParams();
	const {
		data: messages,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetMessagesQuery(id);

	let content = null;

	if (isLoading) {
		content = <p>Loading...</p>;
	} else if (!isLoading && isError) {
		content = <Error message={error?.data} />;
	} else if (!isLoading && isSuccess) {
		content = (
			<>
				<ChatHead
					avatar='https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg'
					name='Akash Ahmed'
				/>
				<Messages messages={messages} />
				<Options />
			</>
		);
	}

	return (
		<div className='w-full lg:col-span-2 lg:block'>
			<div className='w-full grid conversation-row-grid'>{content}</div>
		</div>
	);
}
