import React from 'react'
import { BiMouse, BiDownArrowAlt } from "react-icons/bi";

const ScrollDown = () => {
    return (
        <div className="home__scroll">
            <a href="#about" className="home__scroll-button button--flex">
                <BiMouse className="home__scroll-mouse" />
                <span className="home__scroll-name">Scroll Down</span>
                <BiDownArrowAlt className="home__scroll-arrow" />
            </a>
        </div>
    )
}

export default ScrollDown
