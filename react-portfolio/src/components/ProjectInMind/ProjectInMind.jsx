import React from 'react';
import "./ProjectInMind.css";
import { Link } from 'react-router-dom';
import ProjectImg from "../../assets/project.png";
import { BiSend } from "react-icons/bi";

const ProjectInMind = () => {
    return (
        <section className="project section">
            <div className="project__bg">
                <div className="project__container container grid">
                    <div className="project__data">
                        <h2 className="project__title">Need help with Math or Data?</h2>
                        <p className="project__description">
                            Contact me for tutoring, data analysis, or academic writing assistance. Let's solve problems together!
                        </p>
                        <Link to="/contact" className="button button--flex button--white">
                            Contact Me <BiSend className="button__icon project__icon" />
                        </Link>
                    </div>

                    <img src={ProjectImg} alt="" className="project__img" />
                </div>
            </div>
        </section>
    )
}

export default ProjectInMind;
