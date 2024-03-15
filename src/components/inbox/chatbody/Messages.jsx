import Message from './Message';

export default function Messages({ messages, partner }) {
	return (
		<div className='relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse'>
			<ul className='space-y-2'>
				{messages.length > 0
					? [...messages].reverse().map((message) => {
							return (
								<Message
									key={message.id}
									justify={
										partner?.email === message.sender.email
											? 'start'
											: 'end'
									}
									color={
										partner?.email !== message.sender.email
											? 'bg-violet-700 text-white'
											: 'text-gray-700'
									}
									message={message.message}
								/>
							);
					})
					: messages.length === 0 && <p>No messages found</p>}
			</ul>
		</div>
	);
}
