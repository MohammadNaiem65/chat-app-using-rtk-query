import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function PrivateRoute({ children }) {
	const loggedIn = useAuth();

	return loggedIn ? children : <Navigate to='/login' />;
}
