import React from 'react';
import "./ScrollUp.css";
import { BiUpArrowAlt } from "react-icons/bi";

const ScrollUp = () => {
    React.useEffect(() => {
        const handleScroll = () => {
            const scrollUp = document.querySelector(".scrollup");
            if (window.scrollY >= 560) scrollUp.classList.add("show-scroll");
            else scrollUp.classList.remove("show-scroll");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <a href="#" className="scrollup">
            <BiUpArrowAlt className="scrollup__icon" />
        </a>
    )
}

export default ScrollUp;
