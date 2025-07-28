import { useEffect, useState } from 'react'
import supabase from './services/supabase-client';
import Header from './components/UI/Header';
import SummaryCard from './components/UI/AccountSummary/SummaryCard';
import Calculator from './components/UI/CalculatorComponent/Calculator';
import TradeHistoryLabels from './components/UI/TradeHistory/TradeHistoryLabels';
import TradeHistoryRow from './components/UI/TradeHistory/TradeHistoryRow';
import Updater from './services/updater/updater';
import './App.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [createdTradeComponents, setCreatedTradeComponents] = useState([]);

  // Fetch latest balance from Supabase on mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('orders_placed')
          .select('balance')
          .order('placed_at', { ascending: false })
          .limit(1)
          .single();
        if (error) {
          console.log("Error fetching latest balance: ", error);
        } else {
          console.log(data.balance);

          setUpdatedBalance(data.balance);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchBalance();
  }, [])


  const [balance, setBalance] = useState({
    total: updatedBalance,
    liveBalance: updatedBalance,
    riskPctMax: 10,
    riskPct: 0,
    liveRiskPct: 0
  })

  useEffect(() => {
    setBalance(prev => ({
      ...prev,
      total: updatedBalance,
      liveBalance: updatedBalance
    }));
  }, [updatedBalance])


  const handleCardClick = (data) => {

    if (data.contracts <= 0) {
      return;
    }

    const newId = Date.now();
    const existsAlready = createdTradeComponents.some(component => component.id === newId);

    const now = new Date();
    const formattedString = now.toLocaleString('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });


    if (existsAlready) {
      console.log("Duplicate ID, skipping...");
      return;
    }

    const AmountSpent = Number(data.contracts) * Number(data.premium) * 100;

    const AmountRisking = Number(data.loss) * 100 / balance.total;

    if (AmountRisking + balance.liveRiskPct > 10) {
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
      time: formattedString,
      baseline: balance.liveBalance
    }

    setCreatedTradeComponents(prev => [newComponent, ...prev]);
  }

  const handleConfirmTrade = async (tradeId, closeData) => {
    const { cost, revenue, profit, risk, stopPct, stopVal, contracts, time, ticker, premium, type, PLVal, PLPct, closing_premium } = closeData;

    const tradeToClose = createdTradeComponents.find(trade => trade.id === tradeId);
    var Risk = risk;

    if (!tradeToClose) {
      console.log("Trade not found!");
      return;
    }

    if (profit > 0) {
      Risk = 0;
    }

    const newLiveBalance = balance.liveBalance + revenue;

    setBalance(prevBalance => ({
      ...prevBalance,
      liveBalance: prevBalance.liveBalance + revenue,
      liveRiskPct: Math.max(0, prevBalance.liveRiskPct - Risk),
      riskPct: Math.max(0, prevBalance.riskPct - Risk)
    }))


    setCreatedTradeComponents(prev => prev.filter(trade => trade.id !== tradeId));

    const cryptoID = crypto.randomUUID();

    // Add to supabase here
    const { error } = await supabase
      .from("orders_placed")
      .insert({
        id: cryptoID,
        placed_at: time,
        premium_paid: premium,
        risk_per_trade: risk,
        stop_loss_val: stopVal,
        stop_loss_pct: stopPct,
        closing_premium: closing_premium,
        type: type,
        balance: newLiveBalance,
        contracts: contracts,
        ticker: ticker
      })

    if (error) {
      console.log("Error adding trade to database: ", error);
      toast.warn("Error adding trade to database. Closing...", {
        position: 'top-right',
        style: {
          position: "absolute",
          top: "100px",
          right: "20px"
        }
      });
    } else {
      // Notify successful close
      toast.success('Position closed successfully!', {
        position: 'top-right',
        style: {
          position: "absolute",
          top: "100px",
          right: "20px"
        }
      })
    }
  }

  const handleDeleteTrade = (tradeId, premium, contracts, risk) => {
    const tradeToClose = createdTradeComponents.find(trade => trade.id === tradeId);
    if (!tradeToClose) {
      console.log("Cannot delete a trade that doesn't exist!");
      return;
    }
    setCreatedTradeComponents(prev => prev.filter(trade => trade.id !== tradeId))

    // Need to reset balance here
    setBalance(prevBalance => ({
      ...prevBalance,
      liveBalance: prevBalance.liveBalance + (premium * contracts * 100),
      liveRiskPct: prevBalance.liveRiskPct - risk,
      riskPct: prevBalance.riskPct - risk
    }))
  }

  const setAccBalance = (riskPct) => {
    if (balance.liveRiskPct === 0) {
      return;
    }

    const updatedRisk = balance.liveRiskPct - riskPct > 0 ? balance.liveRiskPct - riskPct : 0;

    setBalance(prev => ({
      ...prev,
      liveRiskPct: updatedRisk
    }))
  }

  const updateLiveBalance = (original, updated, contracts, tradeId) => {
    // original is the original premium, updated is the live changed oneS

    if (original === null || original === "" || updated === null || updated === "") {
      return;
    }

    const tradeIndex = createdTradeComponents.findIndex(trade => trade.id === tradeId);
    if (tradeIndex === -1) return;

    const updatedTrades = [...createdTradeComponents];
    updatedTrades[tradeIndex].premium = updated;
    updatedTrades[tradeIndex].contracts = contracts;

    let runningBalance = balance.total;

    updatedTrades.forEach((trade, index) => {
      trade.baseline = runningBalance;
      const tradeCost = trade.premium * 100 * trade.contracts;
      runningBalance = Math.max(0, runningBalance - tradeCost);
    });

    setCreatedTradeComponents(updatedTrades);

    setBalance(prev => ({
      ...prev,
      liveBalance: runningBalance
    }));

    console.log("Balances recalculated successfully");
  }

  return (
    <>
      <div className="MainContainer" id="MainContainer">
        <Updater></Updater>
        <ToastContainer position="top-center" style={{ position: "absolute", top: "-80px", right: "10px" }}></ToastContainer>
        <Header content="Personal Capital"></Header>
        <div className="MainContentContainer">
          <SummaryCard balance={balance}></SummaryCard>
          <Calculator balance={balance} onCardClick={handleCardClick}></Calculator>
          <div className="HistoryContainer">
            <Header content="Current Trades"></Header>
            <TradeHistoryLabels></TradeHistoryLabels>
            {createdTradeComponents.map(component => (
              <TradeHistoryRow
                key={component.id}
                id={component.id}
                ticker={component.ticker}
                time={component.time}
                premium={component.premium}
                risk={component.risk}
                stopPct={component.stopPct}
                stopVal={component.stopVal}
                contracts={component.contracts}
                onConfirm={handleConfirmTrade}
                setAccBalance={setAccBalance}
                onDelete={handleDeleteTrade}
                updateBalance={updateLiveBalance}
              ></TradeHistoryRow>
            ))}
          </div>
        </div>
      </div >
    </>
  )
}

export default App; 
