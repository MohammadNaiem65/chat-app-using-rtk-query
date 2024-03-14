import { useState } from 'react';
import { Link } from 'react-router-dom';

import { logoImage } from '../assets';
import Error from '../components/ui/Error';
import { useLoginMutation } from '../features/auth/authApi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [data, setData] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const [login, { isSuccess, isError, error: processError }] =
		useLoginMutation();

	const handleLogin = (e) => {
		e.preventDefault();
		setError('');

		login(data);
	};

	useEffect(() => {
		if (isError) {
			setError(processError.data);
		}
	}, [isError, processError?.data]);

	useEffect(() => {
		if (isSuccess) {
			navigate('/');
		}
	}, [navigate, isSuccess]);

	return (
		<div className='grid place-items-center h-screen bg-[#F9FAFB'>
			<div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-md w-full space-y-8'>
					<div>
						<img
							className='mx-auto h-12 w-auto'
							src={logoImage}
							alt='Learn with sumit'
						/>
						<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
							Sign in to your account
						</h2>
					</div>

					<form className='mt-8 space-y-6' onSubmit={handleLogin}>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label
									htmlFor='email-address'
									className='sr-only'>
									Email address
								</label>
								<input
									id='email-address'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Email address'
									value={data.email}
									onChange={(e) =>
										setData((prev) => ({
											...prev,
											email: e.target.value,
										}))
									}
								/>
							</div>
							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Password'
									value={data.password}
									onChange={(e) =>
										setData((prev) => ({
											...prev,
											password: e.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className='flex items-center justify-end'>
							<div className='text-sm'>
								<Link
									to='/register'
									className='font-medium text-violet-600 hover:text-violet-500'>
									Register
								</Link>
							</div>
						</div>
						<div>
							<button
								type='submit'
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'>
								Sign in
							</button>
						</div>

						{error && <Error message={error} />}
					</form>
				</div>
			</div>
		</div>
	);
}
