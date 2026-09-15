import { createContext, useEffect, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) { const [user,setUser]=useState(null); const [loading,setLoading]=useState(true); useEffect(()=>{if(!localStorage.token)return setLoading(false);api.get('/auth/me').then(r=>setUser(r.data.data)).catch(()=>localStorage.removeItem('token')).finally(()=>setLoading(false));},[]);useEffect(()=>{document.documentElement.dataset.theme=user?.settings?.theme||'light'},[user]); const login=({token,user:nextUser})=>{localStorage.setItem('token',token);setUser(nextUser)}; const logout=()=>{localStorage.removeItem('token');setUser(null)}; return <AuthContext.Provider value={{user,setUser,loading,login,logout}}>{children}</AuthContext.Provider>; }
