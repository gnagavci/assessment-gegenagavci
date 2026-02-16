import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    if (!user) return null;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Video Platform
            </Link>
            <div className="navbar-right">
                <Link to="/" className="nav-link">
                    Home
                </Link>
                <Link to="/upload" className="nav-link">
                    Upload
                </Link>
                <span className="nav-user">
                    {user.username}
                    {user.role === "admin" && " (Admin)"}
                </span>
                <button className="nav-logout" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
