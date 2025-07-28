import "./BalanceCard.css";

function BalanceCard({ balance }) {
    const riskVal = balance.liveRiskPct > 0 ? balance.total * (balance.liveRiskPct / 100) : 0;
    const riskPct = balance.liveRiskPct > 0 ? balance.liveRiskPct : 0;

    return (
        <div className="BalanceCardContainer">
            <div className="BalanceTitle">Account Balance</div>
            <div className="BalanceActual">${balance.liveBalance.toLocaleString()}</div>
            <div className="RiskTitlePct">Pct of Acc at Risk</div>
            <div className="RiskActualPct">{riskPct.toLocaleString()}%</div>
            <div className="RiskTitleVal">Acc at Risk</div>
            <div className="RiskActualVal">${riskVal.toLocaleString()}</div>
        </div>
    )
}

export default BalanceCard; 