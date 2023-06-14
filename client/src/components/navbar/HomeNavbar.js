import {NavLink} from "react-router-dom";

const HomeNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <NavLink className="navbar-brand ms-3" to="/"> Social </NavLink>

            {/* TODO: Add functionality to the button using react */}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item"><NavLink className="nav-link" to="/login/">Log in</NavLink></li>
                    <li className="nav-item"><NavLink className="nav-link" to="/signup/">Sign up</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default HomeNavbar;
