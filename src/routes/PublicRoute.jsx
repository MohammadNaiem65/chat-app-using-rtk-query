import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

export default function PublicRoute({ children }) {
	const loggedIn = useAuth();

	return !loggedIn ? children : <Navigate to='/' />;
}
