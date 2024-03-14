import { createBrowserRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Conversation from '../pages/Conversation';
import Inbox from '../pages/Inbox';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PublicRoute from './PublicRoute';

const routes = createBrowserRouter([
	{
		path: '/',
		element: (
			<PrivateRoute>
				<Conversation />
			</PrivateRoute>
		),
	},
	{
		path: '/inbox',
		element: (
			<PrivateRoute>
				<Conversation />
			</PrivateRoute>
		),
	},
	{
		path: '/inbox/:id',
		element: (
			<PrivateRoute>
				<Inbox />
			</PrivateRoute>
		),
	},
	{
		path: '/login',
		element: (
			<PublicRoute>
				<Login />
			</PublicRoute>
		),
	},
	{
		path: '/register',
		element: (
			<PublicRoute>
				<Register />
			</PublicRoute>
		),
	},
]);

export default routes;
