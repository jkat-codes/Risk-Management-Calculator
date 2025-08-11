import './Header.css';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css'; 

export function Header({ content }) {
    return (
        <div className="HeaderContainer">
            <span className="HeaderTitle">{content}</span>
        </div>
    )
}


export function ComplexHeader({content, page}) {
    const navigate = useNavigate(); 
    var NavigateToPage = "/dashboard"; 
    var NavigateToPageIcon = ""; 
    if (page === "settings") {
        // navigate home
        NavigateToPage = "/dashboard"; 
        NavigateToPageIcon = "bx bx-home"; 
    } else if (page === "dashboard") {
        // navigate to settings
        NavigateToPage = "/settings"; 
        NavigateToPageIcon = "bx bx-cog"; 
    }

    return (
        <div className="HeaderContainer">
            <span className="HeaderTitle">{content}</span>
            <button onClick={() => navigate(NavigateToPage)}>
                <i className={NavigateToPageIcon}></i>
            </button>
        </div>
    )
}
