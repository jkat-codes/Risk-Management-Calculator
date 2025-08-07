import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Dashboard from '../src/pages/Dashboard'; 
import Settings from '../src/pages/Settings'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}

export default App; 