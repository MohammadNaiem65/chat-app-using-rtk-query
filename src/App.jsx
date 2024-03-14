import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useAuthCheck } from './hooks';

import Conversation from './pages/Conversation';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Register from './pages/Register';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Conversation />,
	},
	{
		path: '/conversation/:id',
		element: <Inbox />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/register',
		element: <Register />,
	},
]);

function App() {
	const authChecked = useAuthCheck();

	return !authChecked ? (
		<p>Checking Auth...</p>
	) : (
		<RouterProvider router={routes} />
	);
}

export default App;
