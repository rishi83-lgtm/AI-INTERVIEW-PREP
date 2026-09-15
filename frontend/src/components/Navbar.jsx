import {Bell} from 'lucide-react';import useAuth from '../hooks/useAuth';
export default function Navbar({title,action}){const {user}=useAuth();return <header className="topbar"><h1>{title}</h1>{action||<div className="user-chip"><Bell size={18}/><span>{user?.name?.split(' ')[0]||'Candidate'}</span><b>{user?.name?.[0]||'U'}</b></div>}</header>}
