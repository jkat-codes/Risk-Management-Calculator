import React from "react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import './TradeHistoryRow.css'
import { toast } from "react-toastify";

function TradeHistoryRow({ id, ticker, time, premium, risk, stopPct, stopVal, contracts, onConfirm, setAccBalance, onDelete}) {

    if (contracts <= 0) {
        return;
    }

    const [ProfitLossVal, setProfitLossVal] = useState(0);
    const [ProfitLossPctVal, setProfitLossPctVal] = useState(0);
    const [TradeTypeVal, setTradeTypeVale] = useState('');
    const [CloseValue, setCloseValue] = useState(0);
    const [StopValue, setStopValue] = useState(stopVal);
    const [StopPercent, setStopPercent] = useState(stopPct);
    const [showModal, setShowModal] = useState(false);
    const [breakEven, setBreakEven] = useState(false);

    const Take1 = (premium * 1.25).toFixed(2);
    const Take2 = (premium * 1.5).toFixed(2);
    const Take3 = (premium * 1.75).toFixed(2);
    const Take4 = (premium * 2).toFixed(2);

    var value = ProfitLossVal;
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


            setProfitLossVal((take * contracts * 100) - (premium * contracts * 100));
            setProfitLossPctVal((((take * contracts * 100) - (premium * contracts * 100)) / (premium * contracts * 100)) * 100);

            if (take > stop) {
                // Reset Stop Value and Stop Percent (break even)
                setStopValue(premium);
                setStopPercent(0);

                // Reset the risk pct and risk balance to 0 in the Account Balance
                if (!breakEven) {
                    setAccBalance(risk);
                    setBreakEven(true);
                }

            }

            setCloseValue(takeString);
        }
    }

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleConfirmSuccess = (e) => {
        const parent = e.target.parentNode;
        const children = parent.childNodes;
        const price = Number(children[1].childNodes[1].value);

        if (price === "0" || price === 0) {
            var EmptyPrice = children[1].childNodes[1];
            EmptyPrice.style.border = "1px solid red";
            EmptyPrice.animate([
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(0px)' },
            ],
                {
                    duration: 500,
                    easing: 'ease-out',
                    iterations: 1,
                    fill: 'forwards'
                }
            )
            return;
        }

        const contracts = Number(children[2].childNodes[1].value);

        const revenue = contracts * 100 * price;
        const cost = contracts * 100 * premium;
        const profit = revenue - cost;

        const closeData = {
            cost: cost, 
            revenue: revenue, 
            profit: profit, 
            risk: risk, 
            stopPct: StopPercent, 
            stopVal: StopValue, 
            contracts: contracts, 
            time: time, 
            ticker: ticker, 
            premium: premium, 
            type: TradeType, 
            PLVal: value, 
            PLPct: ProfitLossPct, 
            closing_premium: Close
        }

        onConfirm(id, closeData)

        setShowModal(false);
    }

    const handleDeleteTrade = () => {
        onDelete(id, premium, contracts, risk); 
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
            <span className="ColumnLabel">${premium.toFixed(2)}</span>
            <span className="ColumnLabel">{risk}%</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${StopValue}</span>
            <span className="ColumnLabel">{StopPercent}%</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${Take1}</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${Take2}</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${Take3}</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${Take4}</span>
            <span className="ColumnLabel">
                <input id="ProfitLossVal" type='number' onChange={PLValChange} value={value} style={{
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
                <input id="ProfitLossPct" type='number' onChange={PLPctChange} value={ProfitLossPct} style={{
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
            <span className="ColumnLabel clickable">
                <button className="ConfirmBtn" onClick={handleOpenModal}>Close Pos</button>
                {showModal && <ConfirmationModal onClose={handleCloseModal} onConfirm={handleConfirmSuccess} close={Close} contracts={contracts} plval={value} plpct={ProfitLossPct}></ConfirmationModal>}
            </span>
            <span className="ColumnLabel clickable">
                <button className="DeleteBtn" onClick={handleDeleteTrade}>Delete Pos</button>
            </span>
        </div>
    )
}

export default TradeHistoryRow; 