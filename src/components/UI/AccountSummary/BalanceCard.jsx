import "./BalanceCard.css";

function BalanceCard({ balance }) {
    const riskPct = balance.total * (balance.riskPct / 100);
    return (
        <div className="BalanceCardContainer">
            <div className="BalanceTitle">Account Balance</div>
            <div className="BalanceActual">${balance.total.toLocaleString()}</div>
            <div className="RiskTitlePct">Balance at Risk</div>
            <div className="RiskActualPct">${riskPct.toLocaleString()}</div>
            <div className="RiskTitlePct">Pct Balance at Risk</div>
            <div className="RiskActualPct">{balance.riskPct.toLocaleString()}%</div>
        </div>
    )
}

export default BalanceCard; 