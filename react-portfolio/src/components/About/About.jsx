import React from 'react';
import "./About.css";
import AboutImg from "../../assets/ayona_about.jpg";
import Info from './Info';
import { BiFileBlank } from "react-icons/bi";

const About = () => {
    return (
        <section className="about section" id="about">
            <h2 className="section__title">About Me</h2>
            <span className="section__subtitle">My introduction</span>

            <div className="about__container container grid">
                <img src={AboutImg} alt="Ayona Singh" className="about__img" />

                <div className="about__data">
                    <Info />

                    <p className="about__description">
                        I am Ayona Singh, a passionate Mathematics student with a strong foundation in calculus, statistics, linear algebra, and mathematical modeling. I love solving complex problems, analyzing data, and applying mathematical reasoning to real-world challenges. I am always eager to learn and collaborate on projects that blend logic with creativity.
                    </p>

                    <a download="" href="#" className="button button--flex">
                        Download CV <BiFileBlank className="button__icon" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default About;
