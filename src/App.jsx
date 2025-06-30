import { useState } from 'react'
import supabase from './services/supabase-client';
import Header from './components/UI/Header';
import SummaryCard from './components/UI/AccountSummary/SummaryCard';
import Calculator from './components/UI/CalculatorComponent/Calculator';
import './App.css'

function App() {
  const [balance, setBalance] = useState({
    total: 29000,
    riskPct: 5,
  })

  return (
    <>
      <div className="MainContainer">
        <Header content="Personal Capital"></Header>
        <div className="MainContentContainer">
          <SummaryCard balance={balance}></SummaryCard>
          <Calculator balance={balance} updateBalance={setBalance}></Calculator>
        </div>
      </div>
    </>
  )
}

export default App
