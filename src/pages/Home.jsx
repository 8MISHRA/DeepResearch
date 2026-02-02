import Sidebar from '../components/Sidebar'

export default function Home() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="ml-64 p-10 flex-grow">
                <div className="bg-white p-5 rounded-xl shadow-md">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        Real World System Design Concepts!
                    </h1>
                    <br />
                    <p className="text-lg text-slate-600">
                        Hello! Friends Please give few minutes to explore my new blog.
                    </p>
                </div>
            </div>
        </div>
    )
}
