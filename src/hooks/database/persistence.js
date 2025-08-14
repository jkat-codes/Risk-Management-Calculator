import supabase from "../../services/supabase-client";

export const addTrade = async (trade) => {
    try {
        const { data, error } = await supabase.rpc('add_trade', {
            p_ticker: trade.ticker,
            p_trade_id: trade.id,
            p_trade_type: trade.type || '',
            p_contracts: trade.contracts,
            p_trade_cost: trade.trade_cost, 
            p_account_risk: trade.account_risk,
            p_loss: trade.loss,
            p_entry_price: trade.premium,
            p_stop_loss_value: trade.stop_loss_value,
            p_stop_loss_pct: trade.stop_loss_pct,
            p_account_balance: trade.account_balance,
            p_trade_active: trade.trade_active
        });

        if (error) throw error;
        console.log(data);
        return data;
    } catch (error) {
        console.log("Error adding trade: ", error);
        return { error: error.message };
    }
}

export const addPeelTrade = async (trade) => {
    try {
        const {data, error} = await supabase.rpc('add_trade_peel', {
            p_ticker: trade.ticker, 
            p_trade_id: trade.id, 
            p_trade_type: trade.type || '',
            p_contracts: trade.contracts,
            p_contracts_peeled: trade.contracts_peeled, 
            p_trade_cost: trade.trade_cost, 
            p_account_risk: trade.account_risk,
            p_loss: trade.loss,
            p_entry_price: trade.premium,
            p_stop_loss_value: trade.stop_loss_value,
            p_stop_loss_pct: trade.stop_loss_pct,
            p_account_balance: trade.account_balance,
            p_trade_active: trade.trade_active, 
        }); 

        if (error) throw error; 
        console.log(data); 
        return data; 
    } catch (error) {
        console.log("Error adding peel trade: ", error); 
        return {error: error.message}; 
    }
}

export const deleteTrade = async (tradeId) => {
    try {
        const { data, error } = await supabase.rpc('delete_trade', {
            p_trade_id: tradeId
        });

        if (error) throw error;
        console.log(data);
    } catch (error) {
        console.log("Error deleting trade: ", error);
        return { error: error.message };
    }
}

export const deletePeelTrade = async (tradeId) => {
    try {
        const {data, error} = await supabase.rpc('delete_peel_trade', {
            p_trade_id: tradeId
        }); 
        if (error) throw error; 
        console.log(data); 
    } catch (error) {
        console.log("Error deleting peel trade: ", error); 
        return {error: error.message}; 
    }
}

export const updateTrade = async (update) => {
    try {
        const { data, error } = await supabase.rpc('update_trade', {
            p_trade_id: update.id,
            p_entry_price: update.premium,
            p_trade_type: update.type || '',
            p_contracts: update.contracts,
            p_close_price: update.close_price,
            p_trade_cost: update.trade_cost,
            p_break_even: update.break_even,
            p_take_one: update.take_one,
            p_take_two: update.take_two,
            p_take_three: update.take_three,
            p_take_four: update.take_four, 
        })

        if (error) throw error;
        console.log(data);
    } catch (error) {
        console.log("Error updating trade: ", error);
        return { error: error.message };
    }
}

export const fetchActiveTrades = async () => {
    try {
        const { data, error } = await supabase.rpc('fetch_all_trades');
        if (error) throw error;
        return data;
    } catch (error) {
        console.log("Error fetching live trades: ", error);
        return { error: error.message };
    }
}

export const fetchSingleTrade = async (id) => {
    try {
        const { data, error } = await supabase.rpc('fetch_original_premium', {
            p_trade_id: id
        })
        if (error) throw error;
        return data;
    } catch (error) {
        console.log("Error fetching trade: ", error);
        return { error: error.message };
    }
}