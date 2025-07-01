import "./BalanceCard.css";

function BalanceCard({ balance }) {
    const riskVal = balance.riskPct > 0 ? balance.total * (balance.riskPct / 100) : 0;
    const riskPct = balance.riskPct > 0 ? balance.riskPct : 0;
    return (
        <div className="BalanceCardContainer">
            <div className="BalanceTitle">Account Balance</div>
            <div className="BalanceActual">${balance.total.toLocaleString()}</div>
            <div className="RiskTitlePct">Balance at Risk</div>
            <div className="RiskActualPct">${riskVal.toLocaleString()}</div>
            <div className="RiskTitlePct">Pct Balance at Risk</div>
            <div className="RiskActualPct">{riskPct.toLocaleString()}%</div>
        </div>
    )
}

export default BalanceCard; 