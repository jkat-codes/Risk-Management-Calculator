import React from "react";
import supabase from "../../../services/supabase-client";
import './TradeHistoryLabels.css';

function TradeHistoryLabels() {
    return (
        <div className="LabelsContainer">
            <span className="ColumnLabel">Ticker</span>
            <span className="ColumnLabel">Time</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Premium</span>
            <span className="ColumnLabel">Acc Risk</span>
            <span className="ColumnLabel">Stop $</span>
            <span className="ColumnLabel">Stop %</span>
            <span className="ColumnLabel">T1=1R</span>
            <span className="ColumnLabel">T2=2R</span>
            <span className="ColumnLabel">T3=3R</span>
            <span className="ColumnLabel">T4=4R</span>
            <span className="ColumnLabel">P / L $</span>
            <span className="ColumnLabel">P / L %</span>
            <span className="ColumnLabel">Close</span>
            <span className="ColumnLabel">Confirm</span>
        </div>
    )
}

export default TradeHistoryLabels; 