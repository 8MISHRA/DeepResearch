import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <nav className="sidebar fixed h-full w-64 bg-slate-800 text-white flex flex-col p-5">
            <h2 className="text-center mb-8 text-2xl text-slate-100">Dashboard</h2>
            <Link
                to="/idempotency"
                className="no-underline text-slate-300 py-4 px-3 my-1 rounded-lg transition-all duration-300 hover:bg-slate-700 hover:text-white hover:pl-5"
            >
                Idempotency Key
            </Link>
            <Link
                to="/low-level-design"
                className="no-underline text-slate-300 py-4 px-3 my-1 rounded-lg transition-all duration-300 hover:bg-slate-700 hover:text-white hover:pl-5"
            >
                Low level framework
            </Link>
        </nav>
    )
}
