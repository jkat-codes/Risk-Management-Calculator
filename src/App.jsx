import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { AppProvider } from './context/AppContext';
import Dashboard from '../src/pages/Dashboard'; 
import Settings from '../src/pages/Settings'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppProvider>
    </Router>
  )
}

export default App; 