import { Navigation, Sidebar } from "../components/inbox";
import { ChatBody } from "../components/inbox/chatbody";


export default function Inbox() {
	return (
		<div>
			<Navigation />
			<div className='max-w-7xl mx-auto -mt-1'>
				<div className='min-w-full border rounded flex lg:grid lg:grid-cols-3'>
					<Sidebar />
					<ChatBody />
				</div>
			</div>
		</div>
	);
}
