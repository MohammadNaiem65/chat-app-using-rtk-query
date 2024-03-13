import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { createBrowserRouter } from 'react-router-dom';
import Conversation from './pages/Conversation';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Register from './pages/Register';
import { RouterProvider } from 'react-router-dom';

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
	return <RouterProvider router={routes} />;
}

export default App;
