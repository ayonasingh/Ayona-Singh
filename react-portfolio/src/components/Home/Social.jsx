import React from 'react'
import { BiLogoLinkedin, BiLogoGithub, BiLogoInstagram } from "react-icons/bi";

const Social = () => {
    return (
        <div className="home__social">
            <a href="https://www.linkedin.com/in/ayona-singh-10b5561b8/" className="home__social-icon" target="_blank">
                <BiLogoLinkedin />
            </a>
            <a href="https://github.com/" className="home__social-icon" target="_blank">
                <BiLogoGithub />
            </a>
            <a href="https://www.instagram.com/" className="home__social-icon" target="_blank">
                <BiLogoInstagram />
            </a>
        </div>
    )
}

export default Social
