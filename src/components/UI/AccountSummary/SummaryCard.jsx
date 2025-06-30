import './SummaryCard.css';
import BalanceCard from './BalanceCard';

function SummaryCard({ balance }) {
    return (
        <div className="SummaryCardContainer">
            <BalanceCard balance={balance}></BalanceCard>
        </div>
    )
}

export default SummaryCard; 