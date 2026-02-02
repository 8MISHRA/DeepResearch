import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Navigation from '../components/Navigation'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function LowLevelDesign() {
    const [currentSection, setCurrentSection] = useState('intro')
    const [requirementsCollected, setRequirementsCollected] = useState([])
    const [selectedEntities, setSelectedEntities] = useState([])
    const [selectedPattern, setSelectedPattern] = useState('none')

    const contentData = {
        requirements: {
            hidden: [
                { id: 1, q: "What types of vehicles?", a: "Cars, Trucks, and Motorcycles.", type: "Functional" },
                { id: 2, q: "Pricing model?", a: "Hourly rate, different for each vehicle type.", type: "Functional" },
                { id: 3, q: "Multiple floors?", a: "Yes, scalable to N floors.", type: "Non-Functional" },
                { id: 4, q: "Payment methods?", a: "Credit Card and Cash at exit.", type: "Functional" },
                { id: 5, q: "Concurrency?", a: "High traffic, handle race conditions for spots.", type: "Non-Functional" }
            ]
        },
        entities: [
            { name: "ParkingLot", type: "Core", correct: true },
            { name: "Vehicle", type: "Core", correct: true },
            { name: "ParkingSpot", type: "Core", correct: true },
            { name: "Ticket", type: "Core", correct: true },
            { name: "Database", type: "Infra", correct: false },
            { name: "PaymentStrategy", type: "Pattern", correct: true },
            { name: "UserInterface", type: "UI", correct: false },
            { name: "Gate", type: "Core", correct: true }
        ]
    }

    const codeSnippets = {
        none: `
class ParkingSystem {
    // Bad Design: Tight coupling, Hard to extend
    calculatePrice(vehicleType, hours) {
        if (vehicleType == "CAR") {
            return hours * 20;
        } else if (vehicleType == "TRUCK") {
            return hours * 50;
        } else if (vehicleType == "BIKE") {
            return hours * 10;
        }
        // Changing prices requires modifying this class!
        // Violates Open/Closed Principle.
    }
}`,
        strategy: `
// Strategy Pattern: Encapsulate algorithms
interface PricingStrategy {
    double calculate(int hours);
}

class HourlyStrategy implements PricingStrategy {
    calculate(hours) { return hours * 20; }
}

class PremiumStrategy implements PricingStrategy {
    calculate(hours) { return hours * 50; }
}

class Ticket {
    PricingStrategy strategy; // Composed, flexible
    
    double getPrice(int hours) {
        return strategy.calculate(hours);
    }
}`,
        factory: `
// Factory Pattern: Centralize Object Creation
class VehicleFactory {
    static Vehicle createVehicle(String type) {
        switch(type) {
            case "CAR": return new Car();
            case "TRUCK": return new Truck();
            default: throw new InvalidTypeException();
        }
    }
}

// Client Code
Vehicle v = VehicleFactory.createVehicle("CAR");
// We can add new vehicle types without breaking client code.`,
        singleton: `
// Singleton Pattern: Ensure one instance
class ParkingLot {
    private static ParkingLot instance = null;
    
    private ParkingLot() { 
        // Private constructor 
    }

    public static ParkingLot getInstance() {
        if (instance == null) {
            // Thread-safe initialization would go here
            instance = new ParkingLot();
        }
        return instance;
    }
}`
    }

    const chartData = {
        labels: ["Requirements (5m)", "Diagrams/Schema (15m)", "Coding/Patterns (20m)", "Review (5m)"],
        datasets: [{
            data: [10, 30, 40, 20],
            backgroundColor: ['#fca5a5', '#93c5fd', '#6366f1', '#a5b4fc'],
            borderWidth: 0
        }]
    }

    const loadSection = (sectionId) => {
        setCurrentSection(sectionId)
    }

    const revealAnswer = (id) => {
        if (!requirementsCollected.includes(id)) {
            setRequirementsCollected([...requirementsCollected, id])
        }
    }

    const toggleEntity = (name, isCorrect) => {
        if (selectedEntities.includes(name)) {
            setSelectedEntities(selectedEntities.filter(e => e !== name))
        } else if (isCorrect) {
            setSelectedEntities([...selectedEntities, name])
        }
    }

    const getSchemaPreview = () => {
        if (selectedEntities.length === 0) {
            return <div className="opacity-50 italic">Select entities above to generate schema...</div>
        }

        const schemas = {
            ParkingLot: `<div class="mb-2"><span class="text-blue-400">TABLE</span> ParkingLot (<br/>&nbsp;&nbsp;id <span class="text-purple-400">INT PK</span>,<br/>&nbsp;&nbsp;address <span class="text-purple-400">VARCHAR(255)</span><br/>);</div>`,
            Vehicle: `<div class="mb-2"><span class="text-blue-400">TABLE</span> Vehicle (<br/>&nbsp;&nbsp;license_plate <span class="text-purple-400">VARCHAR(20) PK</span>,<br/>&nbsp;&nbsp;type <span class="text-purple-400">ENUM('CAR','TRUCK')</span><br/>);</div>`,
            Ticket: `<div class="mb-2"><span class="text-blue-400">TABLE</span> Ticket (<br/>&nbsp;&nbsp;id <span class="text-purple-400">INT PK</span>,<br/>&nbsp;&nbsp;entry_time <span class="text-purple-400">TIMESTAMP</span>,<br/>&nbsp;&nbsp;spot_id <span class="text-purple-400">INT FK</span>,<br/>&nbsp;&nbsp;vehicle_id <span class="text-purple-400">VARCHAR FK</span><br/>);</div>`,
            ParkingSpot: `<div class="mb-2"><span class="text-blue-400">TABLE</span> ParkingSpot (<br/>&nbsp;&nbsp;id <span class="text-purple-400">INT PK</span>,<br/>&nbsp;&nbsp;floor_id <span class="text-purple-400">INT FK</span>,<br/>&nbsp;&nbsp;is_occupied <span class="text-purple-400">BOOLEAN</span><br/>);</div>`
        }

        return (
            <div dangerouslySetInnerHTML={{
                __html: selectedEntities.map(ent => schemas[ent] || '').join('')
            }} />
        )
    }

    const renderContent = () => {
        switch (currentSection) {
            case 'intro':
                return (
                    <div className="fade-in space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mastering the LLD Questions</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Most candidates fail LLD not because they can't code, but because they jump into coding too fast.
                                A structured approach is your best weapon. We will use the <strong>"5-Step Framework"</strong>.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                                        <div className="ml-4"><h3 className="font-semibold">Clarify Requirements</h3><p className="text-sm text-gray-500">Define scope and constraints first.</p></div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                                        <div className="ml-4"><h3 className="font-semibold">Define Entities</h3><p className="text-sm text-gray-500">Identify the "Nouns" of the system.</p></div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</div>
                                        <div className="ml-4"><h3 className="font-semibold">Relationships & Diagram</h3><p className="text-sm text-gray-500">Composition, Inheritance, Association.</p></div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">4</div>
                                        <div className="ml-4"><h3 className="font-semibold">Code & Patterns</h3><p className="text-sm text-gray-500">Apply Strategy, Factory, Observer.</p></div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-center mb-4 text-gray-500 uppercase">Ideal Time Management</h4>
                                    <div className="chart-container">
                                        <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => loadSection('step1')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition shadow-lg">Start the Framework →</button>
                        </div>
                    </div>
                )

            case 'step1':
                return (
                    <div className="fade-in space-y-6">
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="text-indigo-700 font-medium">Step 1: Clarify Requirements</p>
                            <p className="text-sm text-indigo-600 mt-1">Never assume. Ask questions to define the "Contract" of your system. Click the questions below to simulate asking the interviewer.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4">❓ Ask the Interviewer</h3>
                                <div className="space-y-3">
                                    {contentData.requirements.hidden.map(item => (
                                        <div key={item.id} onClick={() => revealAnswer(item.id)} className={`choice-chip border border-gray-200 rounded-lg p-3 group ${requirementsCollected.includes(item.id) ? 'selected' : ''}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">{item.q}</span>
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded group-hover:bg-white">{item.type}</span>
                                            </div>
                                            {requirementsCollected.includes(item.id) && (
                                                <div className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                                                    {item.a}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-stone-100 p-6 rounded-xl border border-stone-200 relative">
                                <div className="absolute -top-3 left-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">NOTEBOOK</div>
                                <h3 className="font-bold text-gray-800 mb-4 mt-2">📝 Confirmed Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                    {requirementsCollected.length === 0 ? (
                                        <li className="italic text-gray-400">Ask questions to fill this notebook...</li>
                                    ) : (
                                        requirementsCollected.map(id => {
                                            const req = contentData.requirements.hidden.find(r => r.id === id)
                                            return <li key={id} className="fade-in">✅ {req.a}</li>
                                        })
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => loadSection('intro')} className="text-gray-500 hover:text-gray-900">← Back</button>
                            <button onClick={() => loadSection('step2')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm">Next: Define Entities →</button>
                        </div>
                    </div>
                )

            case 'step2':
                return (
                    <div className="fade-in space-y-6">
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="text-indigo-700 font-medium">Step 2: Define Core Entities</p>
                            <p className="text-sm text-indigo-600 mt-1">Identify the "Nouns" in your requirements. Avoid implementation details like "Database" or "UI" at this stage.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">Select the Correct Entities for a Parking Lot</h3>
                            <div className="flex flex-wrap gap-3">
                                {contentData.entities.map(ent => (
                                    <button
                                        key={ent.name}
                                        onClick={() => toggleEntity(ent.name, ent.correct)}
                                        className={`px-4 py-2 rounded-full border transition-colors font-medium text-sm ${selectedEntities.includes(ent.name)
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {ent.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800 text-slate-200 p-6 rounded-xl shadow-md font-mono text-sm overflow-x-auto">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                                <span className="text-yellow-400 font-bold">📂 Database Schema Preview (SQL)</span>
                                <span className="text-xs text-slate-400">Based on selected entities</span>
                            </div>
                            <div className="space-y-4">
                                {getSchemaPreview()}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button onClick={() => loadSection('step1')} className="text-gray-500 hover:text-gray-900">← Back</button>
                            <button onClick={() => loadSection('step3')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm">Next: Relationships →</button>
                        </div>
                    </div>
                )

            case 'step3':
                return (
                    <div className="fade-in space-y-6">
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="text-indigo-700 font-medium">Step 3: Class Relationships</p>
                            <p className="text-sm text-indigo-600 mt-1">Determine how entities interact. Is it Inheritance (Is-A), Composition (Has-A), or Association (Uses-A)?</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-4">
                                <div className="bg-white p-5 rounded-lg border border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-2">Key Concepts</h4>
                                    <ul className="space-y-3 text-sm">
                                        <li className="p-2 bg-blue-50 text-blue-800 rounded"><strong>Composition:</strong> Strong ownership. (e.g., Parking Lot has Floors. If Lot is destroyed, Floors are gone).</li>
                                        <li className="p-2 bg-green-50 text-green-800 rounded"><strong>Aggregation:</strong> Weak ownership. (e.g., Spot has a Vehicle. If Spot closes, Vehicle moves).</li>
                                        <li className="p-2 bg-purple-50 text-purple-800 rounded"><strong>Inheritance:</strong> Specificity. (e.g., Car is a Vehicle).</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="lg:col-span-2 bg-gray-100 p-6 rounded-xl border border-gray-200 overflow-hidden min-h-[400px] flex items-center justify-center relative">
                                <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono">Simulated UML View</div>

                                <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
                                    <div className="col-span-3 flex justify-center">
                                        <div className="uml-card w-48">
                                            <div className="uml-header bg-indigo-100 text-indigo-800">ParkingLot</div>
                                            <div className="uml-body">
                                                + address: Address<br />
                                                + floors: List&lt;Floor&gt;
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 flex justify-center py-4">
                                        <div className="h-8 w-0.5 bg-gray-400"></div>
                                    </div>
                                    <div className="col-span-3 flex justify-center relative">
                                        <div className="absolute -top-4 bg-white px-2 text-xs text-gray-500">Composition (1:N)</div>
                                        <div className="uml-card w-48">
                                            <div className="uml-header">ParkingFloor</div>
                                            <div className="uml-body">
                                                + floorId: int<br />
                                                + spots: List&lt;Spot&gt;<br />
                                                + displayBoard: Board
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 flex justify-center py-4">
                                        <div className="h-8 w-0.5 bg-gray-400"></div>
                                    </div>

                                    <div className="col-span-1 flex justify-center">
                                        <div className="uml-card w-32 opacity-75">
                                            <div className="uml-header text-sm">HandicapSpot</div>
                                            <div className="uml-body text-xs">Is-A Spot</div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className="uml-card w-32 border-blue-500 shadow-md transform scale-105">
                                            <div className="uml-header bg-blue-50 text-blue-900 text-sm">ParkingSpot</div>
                                            <div className="uml-body text-xs">
                                                + id: int<br />
                                                + isFree: bool<br />
                                                + vehicle: Vehicle
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <div className="uml-card w-32 opacity-75">
                                            <div className="uml-header text-sm">LargeSpot</div>
                                            <div className="uml-body text-xs">Is-A Spot</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => loadSection('step2')} className="text-gray-500 hover:text-gray-900">← Back</button>
                            <button onClick={() => loadSection('step4')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm">Next: Design Patterns →</button>
                        </div>
                    </div>
                )

            case 'step4':
                return (
                    <div className="fade-in space-y-6">
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                            <p className="text-indigo-700 font-medium">Step 4: Design Patterns & Extensibility</p>
                            <p className="text-sm text-indigo-600 mt-1">Don't just write code. Write *maintainable* code using Design Patterns. See how they transform the solution.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800">Select a Pattern to Apply:</h3>

                                <div onClick={() => setSelectedPattern('none')} className="pattern-card cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-indigo-400 transition bg-white shadow-sm">
                                    <h4 className="font-bold text-red-500">No Pattern (Naive)</h4>
                                    <p className="text-xs text-gray-500 mt-1">Huge if-else blocks. Hard to maintain.</p>
                                </div>

                                <div onClick={() => setSelectedPattern('factory')} className="pattern-card cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-indigo-400 transition bg-white shadow-sm">
                                    <h4 className="font-bold text-indigo-600">Factory Pattern</h4>
                                    <p className="text-xs text-gray-500 mt-1">For creating objects (Vehicles/Spots) without specifying exact classes.</p>
                                </div>

                                <div onClick={() => setSelectedPattern('strategy')} className="pattern-card cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-indigo-400 transition bg-white shadow-sm">
                                    <h4 className="font-bold text-green-600">Strategy Pattern</h4>
                                    <p className="text-xs text-gray-500 mt-1">For interchangeable algorithms (Pricing Logic: Hourly vs Daily vs Weekend).</p>
                                </div>

                                <div onClick={() => setSelectedPattern('singleton')} className="pattern-card cursor-pointer p-4 rounded-lg border border-gray-200 hover:border-indigo-400 transition bg-white shadow-sm">
                                    <h4 className="font-bold text-purple-600">Singleton Pattern</h4>
                                    <p className="text-xs text-gray-500 mt-1">Ensuring only one instance of ParkingLot exists.</p>
                                </div>
                            </div>

                            <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg flex flex-col h-[500px]">
                                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center space-x-2 border-b border-[#3e3e3e]">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-400 ml-2 font-mono">ParkingSystem.java</span>
                                </div>
                                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                                    <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                                        {codeSnippets[selectedPattern]}
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => loadSection('step3')} className="text-gray-500 hover:text-gray-900">← Back</button>
                            <button onClick={() => loadSection('review')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm">Final Review →</button>
                        </div>
                    </div>
                )

            case 'review':
                return (
                    <div className="fade-in space-y-6">
                        <div className="text-center py-8">
                            <div className="inline-block p-4 rounded-full bg-green-100 text-green-600 mb-4 text-4xl">🏆</div>
                            <h2 className="text-3xl font-bold text-gray-900">Framework Complete</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                                You've walked through the 5 essential steps of LLD. Remember: Clarify → Define Entities → Relationships → Code with Patterns → Review.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4">Quick LLD Checklist</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="w-5 h-5 mr-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                        Did you handle edge cases (e.g., parking full)?
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="w-5 h-5 mr-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                        Is the code extensible (Open/Closed Principle)?
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="w-5 h-5 mr-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                        Did you discuss concurrency (Synchronized methods)?
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="w-5 h-5 mr-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                                        Are your database relationships normalized?
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md">
                                <h3 className="font-bold text-xl mb-2">Ready for the next challenge?</h3>
                                <p className="text-indigo-100 text-sm mb-4">Try applying this same framework to:</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-indigo-700 px-3 py-1 rounded-full text-xs">Movie Booking System</span>
                                    <span className="bg-indigo-700 px-3 py-1 rounded-full text-xs">Elevator System</span>
                                    <span className="bg-indigo-700 px-3 py-1 rounded-full text-xs">Vending Machine</span>
                                </div>
                                <button onClick={() => window.location.reload()} className="mt-6 w-full bg-white text-indigo-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition">Restart Guide</button>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <>
            <Navigation />
            <div className="h-screen flex overflow-hidden bg-stone-50">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col justify-between hidden md:flex">
                    <div>
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-xl font-bold text-indigo-700">LLD Architect</h1>
                            <p className="text-xs text-gray-500 mt-1">Interactive Framework Guide</p>
                        </div>
                        <nav className="mt-6 space-y-1 px-2">
                            <a href="#" onClick={() => loadSection('intro')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'intro' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">👋</span> Introduction
                            </a>
                            <a href="#" onClick={() => loadSection('step1')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'step1' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">1️⃣</span> 1. Requirements
                            </a>
                            <a href="#" onClick={() => loadSection('step2')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'step2' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">2️⃣</span> 2. Entities & Schema
                            </a>
                            <a href="#" onClick={() => loadSection('step3')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'step3' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">3️⃣</span> 3. Relationships
                            </a>
                            <a href="#" onClick={() => loadSection('step4')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'step4' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">4️⃣</span> 4. Design Patterns
                            </a>
                            <a href="#" onClick={() => loadSection('review')} className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-r-lg transition-colors ${currentSection === 'review' ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700' : 'hover:bg-gray-50'}`}>
                                <span className="mr-3">🎓</span> Review & Quiz
                            </a>
                        </nav>
                    </div>
                    <div className="p-4 bg-gray-50 m-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Case Study</h4>
                        <div className="mt-2 flex items-center">
                            <span className="text-2xl mr-2">🚗</span>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Automated Parking Lot</p>
                                <p className="text-xs text-gray-500">Difficulty: Beginner</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-stone-50 relative">
                    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
                        {renderContent()}
                    </div>

                    <footer className="max-w-5xl mx-auto p-6 text-center text-xs text-gray-400">
                        <p>Generated Interactive Guide • Low Level Design Framework</p>
                    </footer>
                </main>
            </div>
        </>
    )
}
