import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gravatarUrl from 'gravatar-url';

import { useGetMessagesQuery } from '../../../features/messages/messagesApi';
import getPartnerInfo from '../../../utils/getPartnerInfo';
import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';
import Error from '../../ui/Error';

export default function ChatBody() {
	const { id } = useParams();
	const { user } = useSelector((state) => state.auth);
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
	} else if (!isLoading && isSuccess && messages.length === 0) {
		content = <p>No data found!</p>;
	} else if (!isLoading && isSuccess && messages.length > 0) {
		const partner = getPartnerInfo(
			[messages[0]?.sender, messages[0]?.receiver],
			user?.email
		);

		content = (
			<>
				<ChatHead
					avatar={gravatarUrl(partner?.email)}
					name={partner?.name}
				/>
				<Messages messages={messages} partner={partner} />
				<Options
					conversationId={messages[0]?.conversationId}
					sender={user}
				/>
			</>
		);
	}

	return (
		<div className='w-full lg:col-span-2 lg:block'>
			<div className='w-full grid conversation-row-grid'>{content}</div>
		</div>
	);
}
