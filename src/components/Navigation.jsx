import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
    const location = useLocation()

    const isActive = (path) => {
        return location.pathname === path || location.hash === `#${path}`
    }

    return (
        <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center font-bold text-xl">
                            DR
                        </div>
                        <span className="font-bold text-xl hidden sm:block">DeepResearch</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                            to="/"
                            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/')
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/idempotency"
                            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/idempotency')
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            Idempotency
                        </Link>
                        <Link
                            to="/low-level-design"
                            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/low-level-design')
                                    ? 'bg-teal-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <span className="hidden sm:inline">Low-Level Design</span>
                            <span className="sm:hidden">LLD</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
