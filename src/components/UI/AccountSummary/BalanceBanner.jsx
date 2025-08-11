import "./BalanceBanner.css"; 
function BalanceBanner({balance, risk}) {
    return (
        <div className="BannerContainer">
            <BalanceSummary title="Account Balance" content={balance}></BalanceSummary>            
            <BalanceSummary title="Maximum Risk Percent" content={risk}></BalanceSummary>
        </div>
    )
}

function BalanceSummary({title, content}) {
    return (
        <div className="BalanceSummaryContainer">
            <span className="PositionHeader">{title}</span>
            <span className="PositionContent">{content}</span>
        </div>
    )
}

export default BalanceBanner; 