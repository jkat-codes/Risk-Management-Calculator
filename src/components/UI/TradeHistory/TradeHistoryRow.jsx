import React from "react";
import './TradeHistoryRow.css';

function TradeHistoryRow({ ticker, time, premium, risk, stopPct, stopVal, }) {
    return (
        <div className="HistoryRowContainer">
            <span className="ColumnLabel">{ticker}</span>
            <span className="ColumnLabel">{time}</span>
            <select className="ColumnLabel" name="type" id="trade-type">
                <option value="call">Call</option>
                <option value="put">Put</option>
            </select>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">{premium}</span>
            <span className="ColumnLabel">{risk}</span>
            <span className="ColumnLabel">{stopVal}</span>
            <span className="ColumnLabel">{stopPct}</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Type</span>
            <span className="ColumnLabel">Type</span>
        </div>
    )
}

export default TradeHistoryRow; 