import React from 'react'
import { Link } from 'react-router-dom';
import { BiSend } from "react-icons/bi";

const Data = () => {
    return (
        <div className="home__data">
            <h1 className="home__title">Ayona Singh</h1>
            <h3 className="home__subtitle">Mathematics Student</h3>
            <p className="home__description">
                Passionate mathematics student with strong analytical skills, problem-solving abilities, and a deep love for numbers, statistics, and mathematical modeling.
            </p>

            <Link to="/contact" className="button button--flex">
                Contact Me <BiSend className="button__icon" />
            </Link>
        </div>
    )
}

export default Data
