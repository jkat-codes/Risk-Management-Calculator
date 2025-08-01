import React, { useEffect } from "react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { fetchSingleTrade } from "../../../hooks/database/persistence";
import './TradeHistoryRow.css'
function TradeHistoryRow({ id, ticker, time, type, premium, risk, stopPct, stopVal, contracts, close, onConfirm, setAccBalance, onDelete, updateBalance }) {

    if (contracts <= 0) {
        return;
    }

    if (type === "" || type === null) {
        type = undefined;
    }

    const [ProfitLossVal, setProfitLossVal] = useState(0);
    const [ProfitLossPctVal, setProfitLossPctVal] = useState(0);
    const [TradeTypeVal, setTradeTypeVale] = useState(type);
    const [CloseValue, setCloseValue] = useState(close);
    const [StopValue, setStopValue] = useState(stopVal);
    const [StopPercent, setStopPercent] = useState(stopPct);
    const [PremiumValue, setPremiumValue] = useState(premium);
    const [showModal, setShowModal] = useState(false);
    const [breakEven, setBreakEven] = useState(false);
    const [OriginalPremium, setOriginalPremium] = useState(premium);
    const [OriginalContracts, setOriginalContracts] = useState(contracts);
    const [ContractsValue, setContractsValue] = useState(contracts);
    const [TakeProfit, setTakeProfit] = useState(false);
    const [BreakEvenHit, setBreakEvenHit] = useState(false);
    const [Take1, setTake1] = useState(null);
    const [Take2, setTake2] = useState(null);
    const [Take3, setTake3] = useState(null);
    const [Take4, setTake4] = useState(null);

    var value = ProfitLossVal;
    var PremiumVal = PremiumValue;
    var ContractsVal = ContractsValue;
    const TradeType = TradeTypeVal;
    const ProfitLossPct = ProfitLossPctVal;
    const Close = CloseValue;

    useEffect(() => {
        const handleBreakEven = async () => {
            const activeTrade = await fetchSingleTrade(id);
            const tradeData = activeTrade.data;
            if (!tradeData) {
                // Trade not in database yet
                setTake1((PremiumVal * (1 + 1 * (stopPct / 100))).toFixed(2));
                setTake2((PremiumVal * (1 + 2 * (stopPct / 100))).toFixed(2));
                setTake3((PremiumVal * (1 + 3 * (stopPct / 100))).toFixed(2));
                setTake4((PremiumVal * (1 + 4 * (stopPct / 100))).toFixed(2));
            } else {
                // Check for break even or take profit here
                if (tradeData.break_even || tradeData.take_one || tradeData.take_two || tradeData.take_three || tradeData.take_four) {
                    const originalStopLossPct = tradeData.original_stop_loss_pct;
                    setTake1((PremiumVal * (1 + 1 * (originalStopLossPct / 100))).toFixed(2));
                    setTake2((PremiumVal * (1 + 2 * (originalStopLossPct / 100))).toFixed(2));
                    setTake3((PremiumVal * (1 + 3 * (originalStopLossPct / 100))).toFixed(2));
                    setTake4((PremiumVal * (1 + 4 * (originalStopLossPct / 100))).toFixed(2));
                } else {
                    setTake1((PremiumVal * (1 + 1 * (stopPct / 100))).toFixed(2));
                    setTake2((PremiumVal * (1 + 2 * (stopPct / 100))).toFixed(2));
                    setTake3((PremiumVal * (1 + 3 * (stopPct / 100))).toFixed(2));
                    setTake4((PremiumVal * (1 + 4 * (stopPct / 100))).toFixed(2));
                }
            }
            const pVal = ((close * ContractsVal * 100) - (PremiumVal * ContractsVal * 100)).toFixed(2)
            const pPct = (((((close * ContractsVal * 100) - (PremiumVal * ContractsVal * 100)) / (PremiumVal * ContractsVal * 100)) * 100).toFixed(2));
            setProfitLossVal(pVal > 0 ? pVal : 0);
            setProfitLossPctVal(pPct > 0 ? pPct : 0);
        }
        handleBreakEven();
    }, [])


    const PLValChange = (e) => {
        setProfitLossVal(e.target.value);
    }

    const TradeTypeChange = (e) => {
        setTradeTypeVale(e.target.value);
        updateBalance(OriginalPremium, PremiumVal, ContractsVal, id, BreakEvenHit, TakeProfit, CloseValue, e.target.value);
    }

    const PLPctChange = (e) => {
        setProfitLossPctVal(e.target.value);
    }

    const PremiumChange = (e) => {
        setPremiumValue(e.target.value); // Changes PremiumVal on next render
        updateBalance(OriginalPremium, e.target.value, ContractsVal, id, BreakEvenHit, TakeProfit, CloseValue, TradeType);
        setStopValue((e.target.value * (1 - 1 * (stopPct / 100))).toFixed(2));
        setTake1((e.target.value * (1 + 1 * (stopPct / 100))).toFixed(2));
        setTake2((e.target.value * (1 + 2 * (stopPct / 100))).toFixed(2));
        setTake3((e.target.value * (1 + 3 * (stopPct / 100))).toFixed(2));
        setTake4((e.target.value * (1 + 4 * (stopPct / 100))).toFixed(2));
    }

    const ContractsChange = (e) => {
        setContractsValue(e.target.value); // Changes ContractsVal on next render
        updateBalance(OriginalPremium, PremiumVal, e.target.value, id, BreakEvenHit, TakeProfit, CloseValue, TradeType);
    }

    const HandleRowClick = (data) => {
        if (data.target) {
            var take = String(data.target.innerHTML);
            var stop = String(StopValue);
            take = take.substring(take.indexOf("$") + 1);
            stop = stop.substring(stop.indexOf("$") + 1);
            var takeString = take;
            take = Number(take);
            stop = Number(stop);

            console.log("Take", take);

            setProfitLossVal(((take * ContractsVal * 100) - (PremiumVal * ContractsVal * 100)).toFixed(2));
            setProfitLossPctVal(((((take * ContractsVal * 100) - (PremiumVal * ContractsVal * 100)) / (PremiumVal * ContractsVal * 100)) * 100).toFixed(2));

            // Get all columns in row
            const parent = data.target.parentNode;
            const rows = parent.childNodes;

            if (take > stop && take !== PremiumVal) {
                // Color the row green here
                for (let i = 0; i < 16; i++) {
                    rows[i].style.background = "#85b278";
                }
                setTakeProfit(true);
                setBreakEvenHit(false);
                updateBalance(OriginalPremium, PremiumVal, ContractsVal, id, false, true, takeString);

            } else if (take === PremiumVal) {
                // Color the row here
                for (let i = 0; i < 16; i++) {
                    rows[i].style.background = "#FFEE8C";
                }
                setBreakEvenHit(true);
                setTakeProfit(false);
                updateBalance(OriginalPremium, PremiumVal, ContractsVal, id, true, false, takeString);
            }

            // Reset Stop Value and Stop Percent (break even)
            setStopValue(PremiumVal);
            setStopPercent(0);

            if (!breakEven) {
                setAccBalance(id);
                setBreakEven(true);
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

        const revenue = ContractsVal * 100 * price;
        const cost = ContractsVal * 100 * PremiumVal;
        const profit = revenue - cost;

        const closeData = {
            cost: cost,
            revenue: revenue,
            profit: profit,
            risk: risk,
            stopPct: StopPercent,
            stopVal: StopValue,
            contracts: ContractsVal,
            time: time,
            ticker: ticker,
            premium: PremiumVal,
            type: TradeType,
            PLVal: value,
            PLPct: ProfitLossPct,
            closing_premium: Close
        }

        onConfirm(id, closeData)

        setShowModal(false);
    }

    const handleDeleteTrade = () => {
        onDelete(id, PremiumVal, ContractsVal, risk);
    }

    return (
        <div className="HistoryRowContainer">
            <span className="ColumnLabel">{ticker}</span>
            <span className="ColumnLabel datetime">{time}</span>
            <span className="ColumnLabel">
                <input id='TradeType' type='text' onChange={TradeTypeChange} value={TradeType} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">
                <input id='TradeType' type='number' onChange={PremiumChange} value={PremiumVal} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">
                <input id='TradeType' type='number' onChange={ContractsChange} value={ContractsVal} style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'center',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">{risk}%</span>
            <span className="ColumnLabel" onClick={HandleRowClick}>${StopValue}</span>
            <span className="ColumnLabel">{StopPercent}%</span>
            <span className="ColumnLabel clickable" onClick={HandleRowClick}>${PremiumVal}</span>
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
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }} />
            </span>
            <span className="ColumnLabel">{Close && parseFloat(Close) > 0 ? Close : ''}</span>
            <span className="ColumnLabel clickable">
                <button className="ConfirmBtn" onClick={handleOpenModal}>Close</button>
                {showModal && <ConfirmationModal onClose={handleCloseModal} onConfirm={handleConfirmSuccess} close={Close} contracts={contracts} plval={value} plpct={ProfitLossPct}></ConfirmationModal>}
            </span>
            <span className="ColumnLabel clickable">
                <button className="DeleteBtn" onClick={handleDeleteTrade}>Delete</button>
            </span>
        </div>
    )
}

export default TradeHistoryRow; 