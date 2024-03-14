import { RouterProvider } from 'react-router-dom';

import { useAuthCheck } from './hooks';

import routes from './routes/route';

function App() {
	const authChecked = useAuthCheck();

	return !authChecked ? (
		<p>Checking Auth...</p>
	) : (
		<RouterProvider router={routes} />
	);
}

export default App;
