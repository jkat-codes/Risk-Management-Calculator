import './Calculator.css';
import './StatRow.css';
import './StatCard.css';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function StatRow({ stats, header, content, onClick }) {
    return (
        <div className="StatContainer clickable" onClick={onClick}>
            <div style={{ backgroundColor: stats.headerBackground }} className="StatHeader">{header}</div>
            <div style={{ backgroundColor: stats.contentBackground }} className="StatContent">${content}</div>
        </div>
    )
}

export function StatRowInput({ identifier, stats, header, value, onChange }) {
    return (
        <div className="StatContainer">
            <div style={{ backgroundColor: stats.headerBackground }} className="StatHeader">{header}</div>
            <input id={identifier} type='number' value={value && parseFloat(value) > 0 ? value : ''} onChange={onChange} style={{ backgroundColor: stats.contentBackground, textAlign: 'center', border: 'none', cursor: 'text', textDecoration: 'none' }} className="StatContent" />
        </div>
    )
}

export function StatRowTickerInput({ stats, header, value, onChange }) {
    return (
        <div className="StatContainer">
            <div style={{ backgroundColor: stats.headerBackground }} className="StatHeader">{header}</div>
            <input className="StatContent" type="text" maxLength={"4"} value={value} onChange={onChange} style={{ backgroundColor: stats.contentBackground, textAlign: 'center', border: 'none', cursor: 'text', textDecoration: 'none', textTransform: 'uppercase' }} />
        </div>
    )
}

export function StatCard({ risk, stopPct, stopVal, loss, budget, contracts, onClick, ticker }) {
    return (
        <div className="StatCardContainer" onClick={onClick}>
            <div className="StatisticHeader">
                <span className="RiskValue">Account Risk: <strong>{risk}</strong></span>
                <span className="StopValue">Stop Level: <strong>{stopPct}%</strong></span>
            </div>
            <div className="CardContent">
                <Statistic title="Max Budget" value={`$${budget}`}></Statistic>
                <Statistic title="Contracts" value={contracts}></Statistic>
                <Statistic title="Potential Loss" value={`$${loss}`}></Statistic>
                <Statistic title="Stop Loss" value={`$${stopVal}`}></Statistic>
            </div>
        </div >
    )
}

export function Statistic({ title, value }) {
    return (
        <div className="StatisticContainer">
            <div className="StatisticTitle">{title}</div>
            <div className="StatisticValue">{value}</div>
        </div>
    )
}


function Calculator({ balance, onCardClick }) {

    const totalBalance = balance.total;

    const [premium, setPremium] = useState('');
    const [ticker, setTicker] = useState('');
    const [stopLevel, setStopLevel] = useState('');


    const premiumValue = parseFloat(premium) || 0;
    const tickerValue = ticker;

    const premiumChange = (e) => {
        setPremium(e.target.value);
    }

    const tickerChange = (e) => {
        setTicker(e.target.value);
    }

    const stopChange = (e) => {
        var stopHTML = String(e.target.innerHTML);
        if (stopHTML.indexOf("%") > 0) {
            const stopValue = stopHTML.substring(0, stopHTML.indexOf("%"));
            setStopLevel(stopValue);

            // Highlight the chosen div
            const highlightedElements = document.querySelectorAll(".highlighted");
            if (highlightedElements.length > 0) {
                highlightedElements.forEach((element) => {
                    element.classList.remove("highlighted");
                })
            }

            // Highlight the chosen stop
            e.target.classList.add("highlighted");
        } else {
            return;
        }
    }

    const handleCardClick = (data) => {
        const missingFields = [];
        if (data.stopVal === "0.00") missingFields.push("Premium");
        if (data.stopPct === '') missingFields.push("Stop");
        if (data.ticker === '') missingFields.push("Ticker");

        if (missingFields.length > 0) {
            toast.error(`Missing: ${missingFields.join(', ')}`, {
                position: 'top-right',
                style: {
                    position: "absolute",
                    top: "100px",
                    right: "20px",
                    color: "#ff6b6b"
                }
            })
        } else {
            // Clear the premium and stop
            setPremium('');
            setTicker('');

            // Place cursor in Premium input
            const PremiumInputField = document.getElementById("PremiumInput");
            PremiumInputField.focus();

            onCardClick(data);
        }

    }


    const Stop10 = (premiumValue * 0.90).toFixed(2);
    const Stop15 = (premiumValue * 0.85).toFixed(2);
    const Stop20 = (premiumValue * 0.80).toFixed(2);
    const Stop25 = (premiumValue * 0.75).toFixed(2);

    const Take1 = (premiumValue * 1.25).toFixed(2);
    const Take2 = (premiumValue * 1.5).toFixed(2);
    const Take3 = (premiumValue * 1.75).toFixed(2);
    const Take4 = (premiumValue * 2).toFixed(2);

    const PotentialLoss1 = (totalBalance * .01).toFixed(2);
    const PotentialLoss2 = (totalBalance * .02).toFixed(2);
    const PotentialLoss25 = (totalBalance * .025).toFixed(2);
    const PotentialLoss3 = (totalBalance * .03).toFixed(2);
    const PotentialLoss4 = (totalBalance * .04).toFixed(2);
    const PotentialLoss5 = (totalBalance * .05).toFixed(2);

    const MaxBudget1 = stopLevel / 100 !== 0 ? ((PotentialLoss1 / (stopLevel / 100)).toFixed(2)) : 0;
    const MaxBudget2 = stopLevel / 100 !== 0 ? ((PotentialLoss2 / (stopLevel / 100)).toFixed(2)) : 0;
    const MaxBudget25 = stopLevel / 100 !== 0 ? ((PotentialLoss25 / (stopLevel / 100)).toFixed(2)) : 0;
    const MaxBudget3 = stopLevel / 100 !== 0 ? ((PotentialLoss3 / (stopLevel / 100)).toFixed(2)) : 0;
    const MaxBudget4 = stopLevel / 100 !== 0 ? ((PotentialLoss4 / (stopLevel / 100)).toFixed(2)) : 0;
    const MaxBudget5 = stopLevel / 100 !== 0 ? ((PotentialLoss5 / (stopLevel / 100)).toFixed(2)) : 0;

    const NumContracts1 = premiumValue !== 0 ? Math.floor((MaxBudget1 / (premiumValue * 100))).toFixed(0) : 0;
    const NumContracts2 = premiumValue !== 0 ? Math.floor((MaxBudget2 / (premiumValue * 100))).toFixed(0) : 0;
    const NumContracts25 = premiumValue !== 0 ? Math.floor((MaxBudget25 / (premiumValue * 100))).toFixed(0) : 0;
    const NumContracts3 = premiumValue !== 0 ? Math.floor((MaxBudget3 / (premiumValue * 100))).toFixed(0) : 0;
    const NumContracts4 = premiumValue !== 0 ? Math.floor((MaxBudget4 / (premiumValue * 100))).toFixed(0) : 0;
    const NumContracts5 = premiumValue !== 0 ? Math.floor((MaxBudget5 / (premiumValue * 100))).toFixed(0) : 0;

    const stopCost = (premiumValue * ((100 - stopLevel) / 100)).toFixed(2);

    const statsLoss = {
        headerBackground: '#df5e5e',
        contentBackground: '#eb8686'
    };

    const statsProfit = {
        headerBackground: "#85b278",
        contentBackground: '#adc0a7'
    };

    const statsNormal = {
        headerBackground: '#6b75b8',
        contentBackground: '#838fdb'
    }

    return (
        <div className="CalculatorContainer">
            <div className="CalculatedStatsContainer">
                <StatRow stats={statsLoss} header={"10% Stop"} content={Stop10} onClick={stopChange}></StatRow>
                <StatRow stats={statsLoss} header={"15% Stop"} content={Stop15} onClick={stopChange}></StatRow>
                <StatRow stats={statsLoss} header={"20% Stop"} content={Stop20} onClick={stopChange}></StatRow>
                <StatRow stats={statsLoss} header={"25% Stop"} content={Stop25} onClick={stopChange}></StatRow>
                <StatRowInput identifier="PremiumInput" stats={statsNormal} header={"Premium"} value={premiumValue} onChange={premiumChange}></StatRowInput>
                <StatRowTickerInput stats={statsNormal} header={"Ticker"} value={tickerValue} onChange={tickerChange}></StatRowTickerInput>
                <StatRow stats={statsProfit} header={"T1=1R"} content={Take1}></StatRow>
                <StatRow stats={statsProfit} header={"T2=2R"} content={Take2}></StatRow>
                <StatRow stats={statsProfit} header={"T3=3R"} content={Take3}></StatRow>
                <StatRow stats={statsProfit} header={"T4=4R"} content={Take4}></StatRow>
            </div>
            <div className="CalculatorCardContainer">
                <StatCard risk="1%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts1,
                        loss: PotentialLoss1,
                        budget: MaxBudget1,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "1"
                    })}
                    premium={premiumValue} ticker={tickerValue} contracts={NumContracts1} loss={PotentialLoss1} budget={MaxBudget1} stopVal={stopCost} stopPct={stopLevel}></StatCard>
                <StatCard risk="2%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts2,
                        loss: PotentialLoss2,
                        budget: MaxBudget2,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "2"
                    })}
                    contracts={NumContracts2} loss={PotentialLoss2} budget={MaxBudget2} stopVal={stopCost} stopPct={stopLevel}></StatCard>
                <StatCard risk="2.5%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts25,
                        loss: PotentialLoss25,
                        budget: MaxBudget25,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "2.5"
                    })}
                    contracts={NumContracts25} loss={PotentialLoss25} budget={MaxBudget25} stopVal={stopCost} stopPct={stopLevel}></StatCard>
                <StatCard risk="3%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts3,
                        loss: PotentialLoss3,
                        budget: MaxBudget3,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "3"
                    })}
                    contracts={NumContracts3} loss={PotentialLoss3} budget={MaxBudget3} stopVal={stopCost} stopPct={stopLevel}></StatCard>
                <StatCard risk="4%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts4,
                        loss: PotentialLoss4,
                        budget: MaxBudget4,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "4"
                    })}
                    contracts={NumContracts4} loss={PotentialLoss4} budget={MaxBudget4} stopVal={stopCost} stopPct={stopLevel}></StatCard>
                <StatCard risk="5%"
                    onClick={() => handleCardClick({
                        contracts: NumContracts5,
                        loss: PotentialLoss5,
                        budget: MaxBudget5,
                        stopVal: stopCost,
                        stopPct: stopLevel,
                        ticker: tickerValue,
                        premium: premiumValue,
                        risk: "5"
                    })}
                    contracts={NumContracts5} loss={PotentialLoss5} budget={MaxBudget5} stopVal={stopCost} stopPct={stopLevel}></StatCard>
            </div>
        </div>
    )
}

export default Calculator; 