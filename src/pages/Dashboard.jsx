import { useEffect, useState } from 'react'
import supabase from '../services/supabase-client';
import Header from '../components/UI/Header';
import SummaryCard from '../components/UI/AccountSummary/SummaryCard';
import Calculator from '../components/UI/CalculatorComponent/Calculator';
import TradeHistoryLabels from '../components/UI/TradeHistory/TradeHistoryLabels';
import TradeHistoryRow from '../components/UI/TradeHistory/TradeHistoryRow';
import Updater from '../services/updater/updater';
import { addTrade, deleteTrade, fetchActiveTrades, updateTrade, addPeelTrade, deletePeelTrade} from '../hooks/database/persistence';
import '../App.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [updatedRiskPct, setUpdatedRiskPct] = useState(0);
  const [updatedRiskVal, setUpdatedRiskVal] = useState(0);
  const [createdTradeComponents, setCreatedTradeComponents] = useState([]);
  const [initialAccountBalance, setInitialAccountBalance] = useState(0);

  // Fetch latest balance from Supabase on mount
  useEffect(() => {
    const fetchInitialBalance = async () => {
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
          return data.balance;
        }
      } catch (err) {
        console.log(err);
        return 0;
      }
    };

    async function loadTrades() {
      const result = await fetchActiveTrades();
      if (result.success) {
        const trades = result.data;
        if (trades.length === 0) {
          // No active trades, fetch latest balance from last placed trade
          const initialBalance = await fetchInitialBalance();
          setInitialAccountBalance(initialBalance);
          setUpdatedBalance(initialBalance);
          setUpdatedRiskPct(0);
          setUpdatedRiskVal(0);
        } else {
          // Active trades, compute total trade costs and subtract from latest placed trade(s) account balance
          const tradeComponents = [];
          let totalBalanceUsed = 0;
          let accountBalance = 0;
          let totalRiskAmount = 0;
          let totalRiskValAmount = 0;

          accountBalance = trades[trades.length - 1].account_balance; // gets earliest starting account balance and calculates from there
          setInitialAccountBalance(accountBalance);

          for (let i = 0; i < trades.length; i++) {
            const trade = trades[i];
            const newComponent = {
              id: trade.trade_id,
              type: trade.trade_type,
              contracts: trade.contracts,
              loss: trade.loss,
              budget: trade.trade_cost,
              stopVal: trade.stop_loss_value,
              stopPct: trade.stop_loss_pct,
              ticker: trade.ticker,
              premium: trade.entry_price,
              risk: Math.abs(trade.account_risk),
              time: trade.created_at,
              baseline: trade.account_balance,
              close: trade.close_price
            }
            tradeComponents.push(newComponent);
            totalBalanceUsed += Math.abs(trade.trade_cost);
            if (!trade.break_even && !trade.take_one && !trade.take_two && !trade.take_three && !trade.take_four) {
              totalRiskAmount += Math.abs(trade.account_risk);
              totalRiskValAmount += Math.abs(trade.loss);
            }
          }

          setCreatedTradeComponents(tradeComponents);
          setUpdatedBalance(accountBalance - totalBalanceUsed);
          setUpdatedRiskPct(totalRiskAmount);
          setUpdatedRiskVal(totalRiskValAmount);
        }
      } else {
        console.log(result.error);
        const initialBalance = await fetchInitialBalance();
        setInitialAccountBalance(initialBalance);
        setUpdatedBalance(initialBalance);
        setUpdatedRiskPct(0);
        setUpdatedRiskVal(0);
      }
    }

    // fetchBalance();
    loadTrades();
  }, [])


  const [balance, setBalance] = useState({
    total: updatedBalance,
    liveBalance: updatedBalance,
    riskPctMax: 10,
    riskPct: updatedRiskPct,
    liveRiskPct: updatedRiskPct,
    liveRiskVal: updatedRiskVal
  })

  useEffect(() => {
    setBalance(prev => ({
      ...prev,
      total: updatedBalance,
      liveBalance: updatedBalance,
      liveRiskPct: updatedRiskPct,
      liveRiskVal: updatedRiskVal
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

    console.log(AmountRisking);

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
        liveRiskVal: prevBalance.liveRiskVal + Number(data.loss)
      }))
    }

    const newComponent = {
      id: newId,
      type: null,
      contracts: data.contracts,
      loss: data.loss,
      budget: data.budget,
      stopVal: data.stopVal,
      stopPct: data.stopPct,
      ticker: (data.ticker).toUpperCase(),
      premium: data.premium,
      risk: data.risk,
      time: formattedString,
      baseline: balance.liveBalance,
      close: 0
    }

    setCreatedTradeComponents(prev => [newComponent, ...prev]);

    // Add to persistence database
    const tradeData = {
      ticker: data.ticker,
      type: null,
      id: newId,
      contracts: parseInt(data.contracts, 10),
      account_risk: data.risk,
      loss: data.loss,
      premium: data.premium,
      stop_loss_value: data.stopVal,
      stop_loss_pct: data.stopPct,
      account_balance: balance.liveBalance,
      trade_active: true
    }

    const peelTradeData = {
      ticker: data.ticker,
      type: null,
      id: newId,
      contracts: parseInt(data.contracts, 10),
      contracts_peeled: 0, 
      account_risk: data.risk,
      loss: data.loss,
      premium: data.premium,
      stop_loss_value: data.stopVal,
      stop_loss_pct: data.stopPct,
      account_balance: balance.liveBalance,
      trade_active: true
    }

    addTrade(tradeData);
    addPeelTrade(peelTradeData); 

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
      riskPct: Math.max(0, prevBalance.riskPct - Risk),
      liveRiskVal: Math.max(0, prevBalance.liveRiskVal - tradeToClose.loss)
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

  const handleConfirmPeel = async(tradeId, peelData) => {
    const tradePeeled = createdTradeComponents.find(trade => trade.id === tradeId); 
    const {cost, revenue, profit, risk, stopPct, stopVal, contracts_original, contracts_peeled, time, premium, type, PLVal, PLPct, closing_premium} = peelData; 
    var Risk = risk; 
    // Update account balance
    if (profit > 0) {
      Risk = 0;
    }

    const newLiveBalance = balance.liveBalance + Math.abs(cost); // You are making the cost back

    setBalance(prevBalance => ({
      ...prevBalance,
      liveBalance: newLiveBalance,
    }))

    // Update trade in persistence
    const updateData = {
      id: tradeId,
      type: tradePeeled.type,
      premium: premium,
      contracts: Number(contracts_original) - contracts_peeled, 
      close_price: Number(closing_premium),
      break_even: premium === closing_premium ? true : false,
      take_one: closing_premium > premium  ? true : false, 
      take_two: closing_premium > premium ? true : false,
      take_three: closing_premium > premium ? true : false,
      take_four: closing_premium > premium ? true : false
    }
    updateTrade(updateData); 
    // Add peel trade to peel database
    const peelTradeData = {
      ticker: tradePeeled.ticker,
      type: tradePeeled.type,
      id: tradeId,
      contracts: Number(contracts_original) , 
      contracts_peeled: contracts_peeled, 
      account_risk: Risk,
      loss: Number(tradePeeled.loss), 
      premium: premium,
      stop_loss_value: stopVal,
      stop_loss_pct: stopPct,
      account_balance: newLiveBalance, 
      trade_active: true
    }
    addPeelTrade(peelTradeData); 

    // If we peel all contracts we want to remove the trade from the log
    if (Number(contracts_original) === contracts_peeled) {
      setCreatedTradeComponents(prev => prev.filter(trade => trade.id !== tradeId)); 
    }
  }


  const handleDeleteTrade = (tradeId, premium, contracts, risk, closing_premium) => {
    const tradeToClose = createdTradeComponents.find(trade => trade.id === tradeId);
    if (!tradeToClose) {
      console.log("Cannot delete a trade that doesn't exist!");
      return;
    }

    setCreatedTradeComponents(prev => prev.filter(trade => trade.id !== tradeId))

    deleteTrade(tradeId);
    deletePeelTrade(tradeId); 

    // Need to reset balance here
    if (closing_premium >= premium) {
      // Only reset the $ amount, the risk has already been adjusted
      setBalance(prevBalance => ({
        ...prevBalance, 
        liveBalance: prevBalance.liveBalance + (premium * contracts * 100)
      }))
    } else {
      // No adjustments have been made, reset all aspects of acc balance
      setBalance(prevBalance => ({
        ...prevBalance,
        liveBalance: prevBalance.liveBalance + (premium * contracts * 100),
        liveRiskPct: prevBalance.liveRiskPct - risk,
        riskPct: prevBalance.riskPct - risk,
        liveRiskVal: prevBalance.liveRiskVal - tradeToClose.loss > 0 ? prevBalance.liveRiskVal - tradeToClose.loss : 0
      }))
    }
  }

  const setAccBalance = (id) => {
    const tradeForUpdate = createdTradeComponents.find(trade => trade.id === id);
    if (!tradeForUpdate) {
      console.log("Trade not found!");
      return
    }

    if (balance.liveRiskPct === 0 && balance.liveRiskVal === 0) {
      return;
    }

    const updatedRisk = balance.liveRiskPct - Number(tradeForUpdate.risk) > 0 ? balance.liveRiskPct - Number(tradeForUpdate.risk) : 0;
    const updatedRiskVal = balance.liveRiskVal - tradeForUpdate.loss > 0 ? balance.liveRiskVal - tradeForUpdate.loss : 0;

    setBalance(prev => ({
      ...prev,
      liveRiskPct: updatedRisk,
      liveRiskVal: updatedRiskVal
    }))
  }

  const updateLiveBalance = (original, updated, contracts, tradeId, BreakEven, TakeProfit, ClosePrice, TradeType) => {
    // original is the original premium, updated is the live changed oneS

    if (original === null || original === "" || updated === null || updated === "" || contracts === "") {
      return;
    }

    const tradeIndex = createdTradeComponents.findIndex(trade => trade.id === tradeId);
    if (tradeIndex === -1) return; // trade not found

    const updatedTrades = [...createdTradeComponents];
    updatedTrades[tradeIndex].premium = updated;
    updatedTrades[tradeIndex].contracts = contracts;
    updatedTrades[tradeIndex].type = TradeType;

    let runningBalance = balance.total;

    console.log(original, updated);

    console.log("Starting balance: ", balance.total);
    console.log("Starting cost: ", original * contracts * 100);
    console.log("Updated cost: ", updated * contracts * 100);

    updatedTrades.forEach((trade, index) => {
      trade.baseline = runningBalance;
      const tradeCost = trade.premium * 100 * trade.contracts;
      runningBalance = Math.max(0, runningBalance - tradeCost);
    });

    setCreatedTradeComponents(updatedTrades);

    if (!BreakEven && !TakeProfit) {
      setBalance(prev => ({
        ...prev,
        liveBalance: runningBalance
      }));
    }


    console.log("Break even: ", BreakEven);
    console.log("Take profit: ", TakeProfit);

    // Update trade in supabase here
    const updateData = {
      id: tradeId,
      type: TradeType,
      premium: updated,
      contracts: parseInt(contracts, 10),
      close_price: Number(ClosePrice),
      break_even: BreakEven,
      take_one: TakeProfit,
      take_two: TakeProfit,
      take_three: TakeProfit,
      take_four: TakeProfit
    }

    updateTrade(updateData);

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
                type={component.type}
                ticker={component.ticker}
                time={component.time}
                premium={component.premium}
                risk={component.risk}
                stopPct={component.stopPct}
                stopVal={component.stopVal}
                contracts={component.contracts}
                close={component.close}
                onConfirm={handleConfirmTrade}
                onConfirmPeel={handleConfirmPeel}
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

export default Dashboard; 