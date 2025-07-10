import React from "react";
import { useState } from "react";
import './TradeHistoryRow.css'

function TradeHistoryRow({ ticker, time, premium, risk, stopPct, stopVal, contracts }) {

    const [ProfitLossVal, setProfitLossVal] = useState(0);
    const [ProfitLossPctVal, setProfitLossPctVal] = useState(0);
    const [TradeTypeVal, setTradeTypeVale] = useState('');
    const [CloseValue, setCloseValue] = useState(0);
    const [StopValue, setStopValue] = useState(stopVal);
    const [StopPercent, setStopPercent] = useState(stopPct);


    const Take1 = (premium * 1.25).toFixed(2);
    const Take2 = (premium * 1.5).toFixed(2);
    const Take3 = (premium * 1.75).toFixed(2);
    const Take4 = (premium * 2).toFixed(2);

    const value = ProfitLossVal;
    const TradeType = TradeTypeVal;
    const ProfitLossPct = ProfitLossPctVal;
    const Close = CloseValue;

    const PLValChange = (e) => {
        setProfitLossVal(e.target.value);
    }

    const TradeTypeChange = (e) => {
        setTradeTypeVale(e.target.value);
    }

    const PLPctChange = (e) => {
        setProfitLossPctVal(e.target.value);
    }

    const HandleRowClick = (data) => {
        if (data.target) {
            var take = String(data.target.innerHTML);
            var stop = String(stopVal);
            take = take.substring(take.indexOf("$") + 1);
            stop = stop.substring(stop.indexOf("$") + 1);
            var takeString = take;
            take = Number(take);
            stop = Number(stop);

            if (take > stop) {
                // Reset Stop Value and Stop Percent (break even)
                setStopValue(premium);
                setStopPercent(0);
            }

            setCloseValue(takeString);
        }
    }

    return (
        <div className="HistoryRowContainer">
            <span className="ColumnLabel">{ticker}</span>
            <span className="ColumnLabel">{time}</span>
            <span className="ColumnLabel">
                <input id='TradeType' type='text' onChange={TradeTypeChange} value={TradeType} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '12px',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">${premium}</span>
            <span className="ColumnLabel">{risk}%</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${StopValue}</span>
            <span className="ColumnLabel">{StopPercent}%</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${Take1}</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${Take2}</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${Take3}</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${Take4}</span>
            <span className="ColumnLabel">
                <input id="ProfitLossVal" type='number' onChange={PLValChange} value={value && parseFloat(value) > 0 ? value : ''} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '12px',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">
                <input id="ProfitLossPct" type='number' onChange={PLPctChange} value={ProfitLossPct && parseInt(ProfitLossPct) > 0 ? ProfitLossPct : ''} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '12px',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">{Close && parseFloat(Close) > 0 ? Close : ''}</span>
        </div>
    )
}

export default TradeHistoryRow; 