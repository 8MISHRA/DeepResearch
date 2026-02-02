import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Idempotency from './pages/Idempotency'
import LowLevelDesign from './pages/LowLevelDesign'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/idempotency" element={<Idempotency />} />
                <Route path="/low-level-design" element={<LowLevelDesign />} />
            </Routes>
        </HashRouter>
    )
}

export default App
