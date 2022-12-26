import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NavProfile = () => {
    const { currentUser } = useAuth();
    const [isOpen, setOpen] = useState(false);
    console.log(isOpen);
    const toggleMenu = () => {
        setOpen((prevState) => !prevState);
    };
    return (
        <div className="dropdown" onClick={toggleMenu}>
            <div className="btn dropdown-toggle d-flex align-items-center">
                <div className="me-2">{currentUser.name}</div>
                <img src={currentUser.image} height="40px" />
            </div>
            <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
                <Link
                    className="dropdown-item"
                    to={`/users/${currentUser._id}`}
                >
                    Profile
                </Link>
                <Link className="dropdown-item" to="/logout">
                    Log out
                </Link>
            </div>
        </div>
    );
};

export default NavProfile;
