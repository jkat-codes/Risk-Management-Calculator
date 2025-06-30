import './Header.css';
function Header({ content }) {
    return (
        <div className="HeaderContainer">
            <span className="HeaderTitle">{content}</span>
        </div>
    )
}

export default Header; 