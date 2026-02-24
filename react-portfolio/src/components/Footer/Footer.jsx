import React from 'react';
import "./Footer.css";
import { Link } from 'react-router-dom';
import { BiLogoLinkedin, BiLogoInstagram, BiLogoGithub } from "react-icons/bi";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container container">
                <h1 className="footer__title">Ayona Singh</h1>

                <ul className="footer__list">
                    <li>
                        <Link to="/about" className="footer__link">About</Link>
                    </li>
                    <li>
                        <Link to="/portfolio" className="footer__link">Portfolio</Link>
                    </li>
                    <li>
                        <Link to="/blogs" className="footer__link">Blogs</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="footer__link">Contact</Link>
                    </li>
                </ul>

                <div className="footer__social">
                    <a href="https://www.linkedin.com/in/ayona-singh-10b5561b8/" className="footer__social-link" target="_blank" rel="noreferrer">
                        <BiLogoLinkedin />
                    </a>

                    <a href="https://www.instagram.com/" className="footer__social-link" target="_blank" rel="noreferrer">
                        <BiLogoInstagram />
                    </a>

                    <a href="https://github.com/" className="footer__social-link" target="_blank" rel="noreferrer">
                        <BiLogoGithub />
                    </a>
                </div>

                <span className="footer__copy">
                    &#169; {new Date().getFullYear()} Ayona Singh. All rights reserved
                </span>
            </div>
        </footer>
    );
};

export default Footer;
