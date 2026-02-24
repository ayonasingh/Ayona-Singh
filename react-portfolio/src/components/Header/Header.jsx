import React, { useState, useEffect } from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import {
    BiHomeAlt, BiUser, BiFileBlank, BiEdit,
    BiMessageSquareDetail, BiGridAlt, BiX
} from "react-icons/bi";

const Header = () => {
    /*=============== Change Background on Scroll ===============*/
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY >= 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /*=============== Toggle Mobile Menu ===============*/
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`header ${scrolled ? "scroll-header" : ""}`}>
            <nav className="nav container">
                <NavLink to="/" className="nav__logo" onClick={closeMenu}>
                    Ayona
                </NavLink>

                <div className={menuOpen ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"}
                                onClick={closeMenu}
                            >
                                <BiHomeAlt className="nav__icon" /> Home
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink
                                to="/about"
                                className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"}
                                onClick={closeMenu}
                            >
                                <BiUser className="nav__icon" /> About
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink
                                to="/skills"
                                className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"}
                                onClick={closeMenu}
                            >
                                <BiFileBlank className="nav__icon" /> Skills
                            </NavLink>
                        </li>

                        <li className="nav__item">
                            <NavLink
                                to="/blogs"
                                className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"}
                                onClick={closeMenu}
                            >
                                <BiEdit className="nav__icon" /> Blogs
                            </NavLink>
                        </li>


                        <li className="nav__item">
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => isActive ? "nav__link active-link" : "nav__link"}
                                onClick={closeMenu}
                            >
                                <BiMessageSquareDetail className="nav__icon" /> Contact
                            </NavLink>
                        </li>
                    </ul>

                    <BiX className="nav__close" onClick={closeMenu} />
                </div>

                <div className="nav__toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <BiGridAlt />
                </div>
            </nav>
        </header>
    );
};

export default Header;
