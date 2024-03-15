export default function Message({ justify, message, color }) {
	return (
		<li className={`flex justify-${justify}`}>
			<div
				className={`relative max-w-xl px-4 py-2 rounded shadow ${color}`}>
				<span className='block'>{message}</span>
			</div>
		</li>
	);
}
