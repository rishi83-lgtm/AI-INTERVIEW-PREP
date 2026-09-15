import Sidebar from './Sidebar';import Navbar from './Navbar';
export default function Layout({title,action,children}){return <div className="app-shell"><Sidebar/><main className="main"><Navbar title={title} action={action}/>{children}</main></div>}
