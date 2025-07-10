import { useState } from 'react'
import supabase from './services/supabase-client';
import Header from './components/UI/Header';
import SummaryCard from './components/UI/AccountSummary/SummaryCard';
import Calculator from './components/UI/CalculatorComponent/Calculator';
import TradeHistoryLabels from './components/UI/TradeHistory/TradeHistoryLabels';
import TradeHistoryRow from './components/UI/TradeHistory/TradeHistoryRow';
import './App.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDropdownMenuPlacement } from 'react-bootstrap/esm/DropdownMenu';

function App() {
  const [balance, setBalance] = useState({
    total: 29000,
    liveBalance: 29000,
    riskPctMax: 10,
    riskPct: 0,
    liveRiskPct: 0
  })

  const [createdTradeComponents, setCreatedTradeComponents] = useState([]);

  const handleCardClick = (data) => {

    const newId = Date.now();
    const existsAlready = createdTradeComponents.some(component => component.id === newId);

    const now = new Date();
    const formattedString = now.toLocaleString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    console.log(formattedString);

    if (existsAlready) {
      console.log("Duplicate ID, skipping...");
      return;
    }

    const AmountSpent = Number(data.loss);

    const AmountRisking = AmountSpent * 100 / balance.total;

    if (AmountRisking + balance.riskPct > 10) {
      console.log("Maximum risk exceeded!");
      toast.error("Maximum risk exceeded!", {
        position: 'top-right',
        style: {
          color: "#ff6b6b"
        }
      })
      return;
    } else if (balance.total - AmountSpent <= 0) {
      console.log("Not enough funds!");
      toast.error("Not enough funds!", {
        position: 'top-right',
        style: {
          color: "#ff6b6b"
        }
      })
      return;
    } else {
      console.log("Updating balances...");
      setBalance(prevBalance => ({
        ...prevBalance,
        liveBalance: prevBalance.liveBalance - AmountSpent,
        liveRiskPct: prevBalance.liveRiskPct + AmountRisking,
        riskPct: prevBalance.riskPct + AmountRisking,
      }))
    }

    const newComponent = {
      id: newId,
      contracts: data.contracts,
      loss: data.loss,
      budget: data.budget,
      stopVal: data.stopVal,
      stopPct: data.stopPct,
      ticker: (data.ticker).toUpperCase(),
      premium: data.premium,
      risk: data.risk,
      time: formattedString
    }

    setCreatedTradeComponents(prev => [...prev, newComponent]);
  }

  return (
    <>
      <div className="MainContainer">
        <ToastContainer position="top-center" style={{ position: "absolute", top: "-80px", right: "10px" }}></ToastContainer>
        <Header content="Personal Capital"></Header>
        <div className="MainContentContainer">
          <SummaryCard balance={balance}></SummaryCard>
          <Calculator balance={balance} onCardClick={handleCardClick}></Calculator>
          <Header content="Current Trades"></Header>
          <TradeHistoryLabels></TradeHistoryLabels>
          <div className="HistoryContainer">
            {createdTradeComponents.map(component => (
              <TradeHistoryRow
                key={component.id}
                ticker={component.ticker}
                time={component.time}
                premium={component.premium}
                risk={component.risk}
                stopPct={component.stopPct}
                stopVal={component.stopVal}
                contracts={component.contracts}
              ></TradeHistoryRow>
            ))}
          </div>
        </div>
      </div >
    </>
  )
}

export default App
