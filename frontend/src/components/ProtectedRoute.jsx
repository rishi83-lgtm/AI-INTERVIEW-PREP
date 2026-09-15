import { Navigate } from 'react-router-dom'; import useAuth from '../hooks/useAuth'; import Loading from './Loading';
export default function ProtectedRoute({children}){const {user,loading}=useAuth();return loading?<Loading/>:user?children:<Navigate to="/login" replace/>}
