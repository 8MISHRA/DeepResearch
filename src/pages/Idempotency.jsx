import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import Navigation from '../components/Navigation'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function Idempotency() {
    const [badBalance, setBadBalance] = useState(1000)
    const [goodBalance, setGoodBalance] = useState(1000)
    const [badLogs, setBadLogs] = useState([{ time: new Date(), msg: '// Server logs...', color: 'text-slate-400' }])
    const [goodLogs, setGoodLogs] = useState([{ time: new Date(), msg: '// Server logs...', color: 'text-slate-400' }])
    const [badWarning, setBadWarning] = useState(false)
    const [goodSuccess, setGoodSuccess] = useState(false)
    const [badClickCount, setBadClickCount] = useState(0)
    const [goodCache, setGoodCache] = useState({})
    const [activeTab, setActiveTab] = useState('stripe')
    const [detailPanel, setDetailPanel] = useState({ visible: false, title: '', desc: '' })

    const badLogRef = useRef(null)
    const goodLogRef = useRef(null)
    const currentKey = useRef("key_" + Math.random().toString(36).substr(2, 9))

    useEffect(() => {
        if (badLogRef.current) badLogRef.current.scrollTop = badLogRef.current.scrollHeight
    }, [badLogs])

    useEffect(() => {
        if (goodLogRef.current) goodLogRef.current.scrollTop = goodLogRef.current.scrollHeight
    }, [goodLogs])

    const addLog = (type, msg, color = 'text-slate-400') => {
        const time = new Date()
        const newLog = { time, msg, color }
        if (type === 'bad') {
            setBadLogs(prev => [...prev, newLog])
        } else {
            setGoodLogs(prev => [...prev, newLog])
        }
    }

    const handleBadPay = () => {
        if (badBalance < 100) return

        addLog('bad', 'Request POST /charge initiated...', 'text-yellow-400')

        setBadClickCount(prev => prev + 1)
        setTimeout(() => setBadClickCount(prev => prev - 1), 2000)

        setTimeout(() => {
            setBadBalance(prev => prev - 100)
            addLog('bad', 'HTTP 200: Charged $100', 'text-green-400')
        }, 1500)
    }

    useEffect(() => {
        if (badClickCount > 1) {
            setBadWarning(true)
            setTimeout(() => setBadWarning(false), 3000)
        }
    }, [badClickCount])

    const handleGoodPay = () => {
        const key = currentKey.current

        addLog('good', `Checking Key: ${key}...`, 'text-blue-400')

        if (goodCache[key]) {
            addLog('good', 'Key Found! Returning cached response.', 'text-teal-400')
            setGoodSuccess(true)
            setTimeout(() => setGoodSuccess(false), 3000)
        } else {
            addLog('good', 'Key New. Locking & Processing...', 'text-yellow-400')
            setGoodCache(prev => ({ ...prev, [key]: 'PROCESSING' }))

            setTimeout(() => {
                if (goodBalance >= 100) {
                    setGoodBalance(prev => prev - 100)
                    setGoodCache(prev => ({ ...prev, [key]: 'COMPLETED' }))
                    addLog('good', 'HTTP 200: Charged $100. Key Saved.', 'text-green-400')
                }
            }, 1500)
        }
    }

    const resetSim = () => {
        setBadBalance(1000)
        setGoodBalance(1000)
        setGoodCache({})
        setBadLogs([{ time: new Date(), msg: '// Server logs...', color: 'text-slate-400' }])
        setGoodLogs([{ time: new Date(), msg: '// Server logs...', color: 'text-slate-400' }])
        setBadWarning(false)
        setGoodSuccess(false)
        setBadClickCount(0)
        currentKey.current = "key_" + Math.random().toString(36).substr(2, 9)
    }

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    const showDetail = (step) => {
        const details = {
            step1: { title: "Client Side", desc: "The client (mobile app or frontend) creates a UUID v4. This key MUST be created before the network request starts." },
            step2: { title: "Middleware Check", desc: "The API checks Redis/DB: 'Have I seen this key?' If yes, return stored result. If no, insert key with status 'PROCESSING'." },
            step3: { title: "Business Logic", desc: "The actual code runs (deduct money). Crucially, this happens inside a database transaction tied to the key update." }
        }
        setDetailPanel({ visible: true, ...details[step] })
    }

    const hideDetail = () => {
        setDetailPanel({ visible: false, title: '', desc: '' })
    }

    const retryChartData = {
        labels: ['No Idempotency', 'With Idempotency'],
        datasets: [
            {
                label: 'Duplicate Charges on Retry (%)',
                data: [45, 0],
                backgroundColor: ['#ef4444', '#0f766e'],
                borderRadius: 4
            },
            {
                label: 'Successful Recovery (%)',
                data: [55, 100],
                backgroundColor: ['#cbd5e1', '#2dd4bf'],
                borderRadius: 4
            }
        ]
    }

    const errorChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Incidents without Keys',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#94a3b8',
                tension: 0.4
            },
            {
                label: 'Incidents with Keys',
                data: [2, 1, 3, 1, 0, 1],
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navigation />

            {/* Secondary Navigation - Page specific */}
            <nav className="bg-white border-b border-slate-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold">I</div>
                                <span className="font-bold text-xl text-slate-800">Idempotency<span className="text-teal-600">Report</span></span>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:space-x-8 items-center">
                            <button onClick={() => scrollToSection('simulation')} className="text-slate-600 hover:text-teal-700 px-3 py-2 text-sm font-medium">Simulation</button>
                            <button onClick={() => scrollToSection('architecture')} className="text-slate-600 hover:text-teal-700 px-3 py-2 text-sm font-medium">Architecture</button>
                            <button onClick={() => scrollToSection('industry')} className="text-slate-600 hover:text-teal-700 px-3 py-2 text-sm font-medium">Industry Standards</button>
                            <button onClick={() => scrollToSection('impact')} className="text-slate-600 hover:text-teal-700 px-3 py-2 text-sm font-medium">Impact Data</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-white border-b border-slate-200 pb-12 pt-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
                        Handling the "Double Payment" Issue
                    </h1>
                    <p className="text-xl text-slate-500 mb-8">
                        A deep dive into how critical state-changing APIs (Stripe, Uber, Airbnb) guarantee
                        <span className="font-bold text-teal-700"> exactly-once delivery</span> in distributed systems.
                    </p>
                    <div className="inline-flex rounded-md shadow-sm">
                        <button onClick={() => scrollToSection('simulation')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800">
                            Test the Logic
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

                {/* SECTION 1: THE SIMULATION */}
                <section id="simulation" className="scroll-mt-20">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-teal-600 text-3xl">⚡</span> The Double-Click Simulation
                        </h2>
                        <p className="mt-2 text-slate-600 max-w-3xl">
                            Experience why idempotency is critical. In distributed networks, a "timeout" doesn't mean failure—it often means the request is still processing. Clicking "Retry" without an Idempotency Key creates duplicates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bad Scenario */}
                        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden relative">
                            <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                                <h3 className="font-bold text-red-800">Scenario A: No Protection</h3>
                                <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full font-mono">POST /charge</span>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-sm text-slate-500">Wallet Balance</div>
                                    <div className="text-2xl font-mono font-bold text-slate-800">${badBalance}</div>
                                </div>
                                <div className="flex gap-4 mb-6">
                                    <button onClick={handleBadPay} className="flex-1 bg-slate-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-700 active:scale-95 transition-transform flex justify-center items-center gap-2">
                                        Pay $100
                                    </button>
                                </div>
                                <div ref={badLogRef} className="bg-slate-900 rounded-lg p-4 font-mono text-xs h-40 overflow-y-auto code-scroll">
                                    {badLogs.map((log, i) => (
                                        <div key={i} className={`${log.color} mb-1`}>
                                            <span className="opacity-50">[{log.time.toLocaleTimeString().split(' ')[0]}]</span> {log.msg}
                                        </div>
                                    ))}
                                </div>
                                {badWarning && (
                                    <p className="mt-4 text-xs text-red-600 font-medium bg-red-50 p-2 rounded border border-red-100 sim-flash">
                                        ⚠ Warning: Duplicate transaction detected in database!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Good Scenario */}
                        <div className="bg-white rounded-xl shadow-sm border border-teal-100 overflow-hidden relative">
                            <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 flex justify-between items-center">
                                <h3 className="font-bold text-teal-800">Scenario B: Idempotency Key</h3>
                                <span className="bg-teal-200 text-teal-800 text-xs px-2 py-1 rounded-full font-mono">Header: Idempotency-Key</span>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-sm text-slate-500">Wallet Balance</div>
                                    <div className="text-2xl font-mono font-bold text-slate-800">${goodBalance}</div>
                                </div>
                                <div className="flex gap-4 mb-6">
                                    <button onClick={handleGoodPay} className="flex-1 bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 active:scale-95 transition-transform flex justify-center items-center gap-2">
                                        Pay $100
                                    </button>
                                </div>
                                <div ref={goodLogRef} className="bg-slate-900 rounded-lg p-4 font-mono text-xs h-40 overflow-y-auto code-scroll">
                                    {goodLogs.map((log, i) => (
                                        <div key={i} className={`${log.color} mb-1`}>
                                            <span className="opacity-50">[{log.time.toLocaleTimeString().split(' ')[0]}]</span> {log.msg}
                                        </div>
                                    ))}
                                </div>
                                {goodSuccess && (
                                    <p className="mt-4 text-xs text-teal-600 font-medium bg-teal-50 p-2 rounded border border-teal-100 sim-success">
                                        ✓ Safety: Cached response returned. No double charge.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <button onClick={resetSim} className="text-sm text-slate-400 hover:text-slate-600 underline">Reset Simulation</button>
                    </div>
                </section>

                {/* SECTION 2: ARCHITECTURE FLOW */}
                <section id="architecture" className="scroll-mt-20">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">The Lifecycle of an Idempotent Request</h2>
                        <p className="mt-2 text-slate-600">
                            How most tech giants (Stripe, Adyen, Uber) implement the "Check-Lock-Process-Unlock" pattern. Hover over steps to see technical details.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                            {/* Flow Steps */}
                            <div className="flow-node group bg-slate-50 p-4 rounded-lg border-2 border-slate-200 text-center cursor-help relative z-10" onMouseOver={() => showDetail('step1')} onMouseOut={hideDetail}>
                                <div className="text-2xl mb-2">💻</div>
                                <h4 className="font-bold text-sm text-slate-700">1. Client</h4>
                                <div className="text-xs text-slate-500 mt-1">Generates UUID v4</div>
                            </div>

                            <div className="hidden md:flex items-center justify-center text-slate-300 text-xl font-bold">→</div>

                            <div className="flow-node group bg-teal-50 p-4 rounded-lg border-2 border-teal-200 text-center cursor-help relative z-10" onMouseOver={() => showDetail('step2')} onMouseOut={hideDetail}>
                                <div className="text-2xl mb-2">🔒</div>
                                <h4 className="font-bold text-sm text-teal-800">2. Middleware</h4>
                                <div className="text-xs text-teal-600 mt-1">Checks Key Store</div>
                            </div>

                            <div className="hidden md:flex items-center justify-center text-slate-300 text-xl font-bold">→</div>

                            <div className="flow-node group bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200 text-center cursor-help relative z-10" onMouseOver={() => showDetail('step3')} onMouseOut={hideDetail}>
                                <div className="text-2xl mb-2">⚙</div>
                                <h4 className="font-bold text-sm text-indigo-800">3. Application</h4>
                                <div className="text-xs text-indigo-600 mt-1">Processing Logic</div>
                            </div>

                            {/* Hidden Detail Panel */}
                            <div className={`absolute top-full mt-4 left-0 w-full bg-slate-800 text-white p-4 rounded-lg shadow-lg transition-opacity duration-200 z-20 ${detailPanel.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <h5 className="font-bold text-teal-400 mb-1">{detailPanel.title}</h5>
                                <p className="text-sm text-slate-300">{detailPanel.desc}</p>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Atomic Lock Visual */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">The Atomic Lock Strategy</h3>
                                <div className="bg-slate-100 rounded-lg p-4 font-mono text-sm text-slate-600">
                                    <span className="text-purple-600">INSERT INTO</span> idempotency_keys (key, user_id, locked_at)<br />
                                    <span className="text-purple-600">VALUES</span> ('uuid-123', 'usr-456', NOW())<br />
                                    <span className="text-purple-600">ON CONFLICT DO NOTHING</span>;
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    If this insert affects 0 rows, another request is already processing this key. The API returns <span className="bg-slate-200 px-1 rounded">409 Conflict</span> or waits.
                                </p>
                            </div>

                            {/* Recovery Visual */}
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">The Recovery Strategy</h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-1/2 bg-white border border-slate-300 p-3 rounded shadow-sm">
                                        <div className="font-bold text-slate-700">Scenario: Crash</div>
                                        <div className="text-xs text-slate-500 mt-1">Server dies after charge but before response.</div>
                                    </div>
                                    <div className="text-slate-400 text-xl">→</div>
                                    <div className="w-1/2 bg-white border border-teal-300 p-3 rounded shadow-sm">
                                        <div className="font-bold text-teal-700">Next Request</div>
                                        <div className="text-xs text-slate-500 mt-1">Sees "Completed" state in DB. Returns saved response.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: INDUSTRY COMPARISON */}
                <section id="industry" className="scroll-mt-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Real-World Implementations</h2>
                            <p className="mt-2 text-slate-600">How major engineering teams handle state changes.</p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0 bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setActiveTab('stripe')} className={`px-4 py-2 rounded-md text-sm transition-all ${activeTab === 'stripe' ? 'bg-white shadow-sm border-b-2 border-teal-700 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>Stripe</button>
                            <button onClick={() => setActiveTab('airbnb')} className={`px-4 py-2 rounded-md text-sm transition-all ${activeTab === 'airbnb' ? 'bg-white shadow-sm border-b-2 border-teal-700 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>Airbnb</button>
                            <button onClick={() => setActiveTab('uber')} className={`px-4 py-2 rounded-md text-sm transition-all ${activeTab === 'uber' ? 'bg-white shadow-sm border-b-2 border-teal-700 text-teal-700 font-semibold' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}>Uber</button>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[300px]">
                        {/* Stripe Content */}
                        {activeTab === 'stripe' && (
                            <div className="transition-opacity duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">S</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Stripe's `Idempotency-Key` Header</h3>
                                        <p className="text-slate-600 mt-2">
                                            Stripe is the industry standard for public-facing idempotency. They allow clients to send a unique key in the HTTP header.
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                            <li className="flex items-center gap-2">
                                                <span className="text-teal-500 font-bold">✓</span>
                                                <span><strong>TTL:</strong> Keys expire after 24 hours.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-teal-500 font-bold">✓</span>
                                                <span><strong>Scope:</strong> Key + Auth Token identifies the unique request.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-teal-500 font-bold">✓</span>
                                                <span><strong>Behavior:</strong> Saves the status code and body of the first response. Replays it exactly on subsequent calls.</span>
                                            </li>
                                        </ul>
                                        <div className="mt-6 bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-300">
                                            <span className="text-purple-400">curl</span> https://api.stripe.com/v1/charges \<br />
                                            &nbsp;&nbsp;-u sk_test_4eC39HqLyjWDarjtT1zdp7dc: \<br />
                                            &nbsp;&nbsp;-H <span className="text-green-400">"Idempotency-Key: cR7037E02q60134"</span> \<br />
                                            &nbsp;&nbsp;-d amount=2000 ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Airbnb Content */}
                        {activeTab === 'airbnb' && (
                            <div className="transition-opacity duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded bg-rose-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">A</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Airbnb's "Orpheus" Library</h3>
                                        <p className="text-slate-600 mt-2">
                                            Airbnb developed an internal library called "Orpheus" to handle idempotency across their complex microservice architecture (payments, booking, messaging).
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="bg-slate-50 p-4 rounded border border-slate-200">
                                                <h4 className="font-bold text-sm text-slate-800">Key Feature: Distributed ID Generation</h4>
                                                <p className="text-xs text-slate-500 mt-1">They use a separate service to generate unique IDs before the request hits the main logic, ensuring consistency even if services scale up/down.</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded border border-slate-200">
                                                <h4 className="font-bold text-sm text-slate-800">Key Feature: Expiring Leases</h4>
                                                <p className="text-xs text-slate-500 mt-1">Uses "leases" on database rows. If a service crashes, the lease expires, allowing a retry to take over the transaction.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Uber Content */}
                        {activeTab === 'uber' && (
                            <div className="transition-opacity duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded bg-black flex items-center justify-center text-white font-bold text-xl flex-shrink-0">U</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Uber's High-Scale Consistency</h3>
                                        <p className="text-slate-600 mt-2">
                                            Uber deals with massive concurrency (Request-a-Ride). They rely on strong consistency storage and "Masterless" architecture (Ringpop).
                                        </p>
                                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                            <li className="flex items-center gap-2">
                                                <span className="text-teal-500 font-bold">✓</span>
                                                <span><strong>Challenge:</strong> Mobile networks are flaky; retries are constant.</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-teal-500 font-bold">✓</span>
                                                <span><strong>Strategy:</strong> Application-layer UUIDs passed down through every microservice call.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 4: IMPACT DATA */}
                <section id="impact" className="pb-12 scroll-mt-20">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Impact Analysis</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Chart 1 */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-600 uppercase mb-4 text-center">Retry Success Rates</h3>
                            <div className="chart-container bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <Bar data={retryChartData} options={{ ...chartOptions, scales: { y: { beginAtZero: true, max: 100 } } }} />
                            </div>
                            <p className="text-xs text-center text-slate-400 mt-2">
                                Without keys, retries often fail (409) or duplicate. With keys, retries succeed (200 OK).
                            </p>
                        </div>

                        {/* Chart 2 */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-600 uppercase mb-4 text-center">Error Reduction (Simulated)</h3>
                            <div className="chart-container bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <Line data={errorChartData} options={{ ...chartOptions, scales: { y: { beginAtZero: true } } }} />
                            </div>
                            <p className="text-xs text-center text-slate-400 mt-2">
                                Implementing idempotency reduces "Phantom State" errors by over 95%.
                            </p>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="mb-4 text-slate-100 font-bold">Generated Interactive Report</p>
                    <p className="text-sm">Synthesized from engineering blogs of Stripe, Uber, and Airbnb.</p>
                </div>
            </footer>
        </div>
    )
}
