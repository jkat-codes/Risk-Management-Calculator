import { createContext, useContext, useState, useEffect } from 'react'; 
import supabase from '../services/supabase-client'; 
import { fetchActiveTrades } from '../hooks/database/persistence';

const AppContext = createContext(); 

export function AppProvider({ children }) {
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [updatedRiskPct, setUpdatedRiskPct] = useState(0);
  const [updatedRiskVal, setUpdatedRiskVal] = useState(0);
  const [createdTradeComponents, setCreatedTradeComponents] = useState([]);
  const [initialAccountBalance, setInitialAccountBalance] = useState(0);

  const fetchLatestManualBalance = async () => {
    try {
      console.log("Fetching manual balance..."); 
      const { data, error } = await supabase
        .from('balance_updates')
        .select('balance, total, risk_pct_max, updated_at')
        .order('updated_at', {ascending: false})
        .limit(1)
        .single(); 

      if (error && error.code !== "PGRST116") {
        console.log("Error fetching manual balance: ", error); 
        return null; 
      } 

      return data; 

    } catch (error) {
      console.log("Error fetching manual balance: ", error); 
      return null; 
    }
  }

  // Fetch latest balance from Supabase on mount
  useEffect(() => {
    const fetchInitialBalance = async () => {
      try {
        const { data, error } = await supabase
          .from('orders_placed')
          .select('placed_at, balance')
          .order('placed_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.log("Error fetching latest balance: ", error);
        } else {
          console.log("Fetching account balance from latest trade..."); 
          return data;
        }
      } catch (err) {
        console.log(err);
        return 0;
      }
    };

    async function loadTrades() {
      const result = await fetchActiveTrades();
      const manualBalance = await fetchLatestManualBalance(); 
      const latestOrder = await fetchInitialBalance(); 
      if (result.success) {
        const trades = result.data;
        if (trades.length === 0) {
          // There are no active trades
          let baseBalance = 0; 
          if (manualBalance && latestOrder) {
            console.log("Manual: ", manualBalance.updated_at); 
            console.log("Latest: ", latestOrder.placed_at); 
            baseBalance = new Date(manualBalance.updated_at) > new Date(latestOrder.placed_at) ? manualBalance.balance : latestOrder.balance
          }

          setInitialAccountBalance(baseBalance); 
          setUpdatedBalance(baseBalance); 
        
          if (baseBalance) {
            setBalance(prev => ({
              ...prev, 
              total: baseBalance, 
              liveBalance: baseBalance, 
              riskPctMax: manualBalance.risk_pct_max
            })); 
          }
          // No active trades, fetch latest balance from last placed trade
          setUpdatedRiskPct(0);
          setUpdatedRiskVal(0);
        } else {
          // Active trades, compute total trade costs and subtract from latest placed trade(s) account balance
          const tradeComponents = [];
          let totalBalanceUsed = 0;
          let accountBalance = 0;
          let totalRiskAmount = 0;
          let totalRiskValAmount = 0;
          accountBalance = new Date(manualBalance.updated_at) > new Date(latestOrder.placed_at) ? manualBalance.balance : latestOrder.balance
          setInitialAccountBalance(accountBalance);

          for (let i = 0; i < trades.length; i++) {
            const trade = trades[i];
            const date = new Date(trade.created_at); 
            const time = date.toLocaleString('en-US', {
              year: '2-digit', 
              month: '2-digit', 
              day: '2-digit', 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: true
            }); 
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
              time: time,
              baseline: trade.account_balance,
              close: trade.close_price
            }
            console.log(trade.trade_cost); 

            tradeComponents.push(newComponent);
            totalBalanceUsed += Math.abs(trade.trade_cost);
            if (!trade.break_even && !trade.take_one && !trade.take_two && !trade.take_three && !trade.take_four) {
              totalRiskAmount += Math.abs(trade.account_risk);
              totalRiskValAmount += Math.abs(trade.loss);
            }
          }

          let calculatedBalance; 
          if (accountBalance) {
            calculatedBalance = accountBalance - totalBalanceUsed; 
            setInitialAccountBalance(calculatedBalance); 

            setBalance(prev => ({
              ...prev, 
              riskPctMax: manualBalance.risk_pct_max
            })); 
          } else {
            calculatedBalance = accountBalance - totalBalanceUsed; 
          }

          console.log("Total balance used: ", totalBalanceUsed); 
          console.log("Account balance: ", accountBalance); 

          setCreatedTradeComponents(tradeComponents);
          setUpdatedBalance(calculatedBalance);
          setUpdatedRiskPct(totalRiskAmount);
          setUpdatedRiskVal(totalRiskValAmount);
        }
      } else {
        if (manualBalance) {
          setInitialAccountBalance(manualBalance.balance); 
          setUpdatedBalance(manualBalance.balance); 
          setBalance(prev => ({
            ...prev, 
            total: manualBalance.total, 
            liveBalance: manualBalance.balance, 
            riskPctMax: manualBalance.risk_pct_max
          })); 
        } else {
          const initialBalance = await fetchInitialBalance();
          setInitialAccountBalance(initialBalance);
          setUpdatedBalance(initialBalance);
        }
        console.log(result.error);
        setUpdatedRiskPct(0);
        setUpdatedRiskVal(0);
      }
    }

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
  }, [updatedBalance]); 

  return (
    <AppContext.Provider value={{
        balance, 
        setBalance, 
        createdTradeComponents, 
        setCreatedTradeComponents, 
        initialAccountBalance, 
        setInitialAccountBalance, 
        updatedBalance,
        setUpdatedBalance, 
        updatedRiskPct, 
        setUpdatedRiskPct, 
        updatedRiskVal, 
        setUpdatedRiskVal
    }}>
        {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
    const context = useContext(AppContext); 
    if (!context) {
        throw new Error("useApp must be within AppProvider"); 
    }
    return context; 
}
