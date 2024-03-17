import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import conversationApi, {
	useAddConversationMutation,
	useEditConversationMutation,
} from '../../features/conversation/conversationApi';
import { useGetUserQuery } from '../../features/user/userApi';

import Error from '../ui/Error';

const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Modal({ open, control }) {
	const [data, setData] = useState({
		email: '',
		message: '',
		conversationId: null,
		partnerExists: false,
	});
	const [error, setError] = useState('');
	const { user } = useSelector((state) => state.auth);

	const { data: partnerDetail } = useGetUserQuery(data.email, {
		skip: !data.email,
	});
	const [addConversation, { isSuccess: addConversationIsSuccess }] =
		useAddConversationMutation();
	const [editConversation, { isSuccess: editConversationIsSuccess }] =
		useEditConversationMutation();
	const { data: conversations } =
		conversationApi.endpoints.getConversations.useQueryState(user?.email);

	// search for partner details
	const handleEmailSearch = (e) => {
		setError('');
		setData((prev) => ({
			...prev,
			email: '',
			conversationId: null,
			partnerExists: false,
		}));

		const email = e.target.value;
		const validEmail = email.toLowerCase().match(emailRegex);

		if (validEmail) {
			setData((prev) => ({ ...prev, email: validEmail?.input }));
		}
	};

	const handleDebounce = () => {
		let timeout;
		return (...args) => {
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				handleEmailSearch(...args);
			}, 750);
		};
	};

	// handle send message
	const handleSendMessage = (e) => {
		e.preventDefault();
		const sender = {
			id: user.id,
			name: user.name,
			email: user.email,
		};

		// edit conversation
		if (data.partnerExists && data.conversationId) {
			const messageDetails = {
				message: data.message,
				timestamp: Date.now(),
			};

			editConversation({
				sender,
				id: data.conversationId,
				data: messageDetails,
			});
		}
		// add conversation
		else if (data.partnerExists && !data.conversationId) {
			const {
				email: partnerEmail,
				name: partnerName,
				id: partnerId,
			} = partnerDetail[0];

			const messageDetails = {
				participants: `${sender.email}-${partnerEmail}`,
				users: [
					sender,
					{
						id: partnerId,
						name: partnerName,
						email: partnerEmail,
					},
				],
				message: data.message,
				timestamp: Date.now(),
			};

			addConversation({ data: messageDetails, sender });
		}
	};

	// check if the partner and any conversation exits with this partner
	useEffect(() => {
		if (Array.isArray(partnerDetail) && partnerDetail?.length === 0) {
			setError('No user found for this email. Provide a valid email.');
		} else if (Array.isArray(partnerDetail) && partnerDetail?.length > 0) {
			if (partnerDetail[0]?.email === user.email) {
				return setError("You can't message yourself");
			}

			const conversationExists = conversations.find((conversation) =>
				conversation.users.find(
					(user) => user.email === partnerDetail[0].email
				)
			);

			if (conversationExists) {
				setData((prev) => ({
					...prev,
					conversationId: conversationExists?.id,
				}));
			}

			setData((prev) => ({ ...prev, partnerExists: true }));
		}
	}, [conversations, partnerDetail, user?.email]);

	// close modal upon successful edit/add conversation
	useEffect(() => {
		if (addConversationIsSuccess || editConversationIsSuccess) {
			control();
		}

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addConversationIsSuccess, editConversationIsSuccess]);

	// remove error if any input field changes
	useEffect(() => {
		setError('');
	}, [data.email, data.password]);

	return (
		open && (
			<>
				<div
					onClick={control}
					className='fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer'></div>
				<div className='rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Send message
					</h2>
					<form
						className='mt-8 space-y-6'
						onSubmit={handleSendMessage}>
						<input type='hidden' name='remember' value='true' />
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='to' className='sr-only'>
									To
								</label>
								<input
									id='to'
									name='to'
									type='to'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Send to'
									onChange={handleDebounce()}
								/>
							</div>
							<div>
								<label htmlFor='message' className='sr-only'>
									Message
								</label>
								<textarea
									id='message'
									name='message'
									type='message'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Message'
									value={data.message}
									onChange={(e) =>
										setData((prev) => ({
											...prev,
											message: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-700'
								disabled={
									!data.partnerExists ||
									!data.message ||
									error
								}>
								Send Message
							</button>
						</div>

						{error && <Error message={error} />}
					</form>
				</div>
			</>
		)
	);
}
