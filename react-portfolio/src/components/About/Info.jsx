import React from 'react'
import { BiAward, BiBookOpen, BiCalculator } from "react-icons/bi";

const Info = () => {
    return (
        <div className="about__info grid">
            <div className="about__box">
                <BiAward className="about__icon" />
                <h3 className="about__title">Achievements</h3>
                <span className="about__subtitle">Academic Excellence</span>
            </div>

            <div className="about__box">
                <BiBookOpen className="about__icon" />
                <h3 className="about__title">Courses</h3>
                <span className="about__subtitle">15+ Completed</span>
            </div>

            <div className="about__box">
                <BiCalculator className="about__icon" />
                <h3 className="about__title">Projects</h3>
                <span className="about__subtitle">10 + Math Projects</span>
            </div>
        </div>
    )
}

export default Info
