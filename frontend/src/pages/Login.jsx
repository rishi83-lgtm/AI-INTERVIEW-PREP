import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import AuthPortal from '../components/AuthPortal';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const finishAuth = response => {
		login(response.data.data);
		navigate('/dashboard');
	};
	const onLogin = async form => {
		const response = await api.post('/auth/login', form);
		finishAuth(response);
	};
	const onRegister = async form => {
		const response = await api.post('/auth/register', form);
		finishAuth(response);
	};
	return <AuthPortal initialView="signin" onLogin={onLogin} onRegister={onRegister} />;
}
