import React, { useEffect, useState } from 'react';
import './About.css';
import AboutImgFallback from '../../assets/ayona_about.jpg';
import { BiFileBlank, BiAward, BiBookOpen, BiCalculator } from 'react-icons/bi';
import axios from 'axios';
import BASE_URL from '../../config/api';

const ICON_MAP = {
    BiAward: <BiAward className="about__icon" />,
    BiBookOpen: <BiBookOpen className="about__icon" />,
    BiCalculator: <BiCalculator className="about__icon" />,
};

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);

    useEffect(() => {
        Promise.all([
            axios.get(`${BASE_URL}/about`),
            axios.get(`${BASE_URL}/contact-info`),
        ]).then(([aboutRes, contactRes]) => {
            setAboutData(aboutRes.data);
            setContactInfo(contactRes.data);
        }).catch(() => {
            // fallback silently — default hardcoded values used
        });
    }, []);

    const imgSrc = aboutData?.image || AboutImgFallback;
    const description = aboutData?.description || 'I am Ayona Singh, a passionate Mathematics student with a strong foundation in calculus, statistics, linear algebra, and mathematical modeling. I love solving complex problems, analyzing data, and applying mathematical reasoning to real-world challenges. I am always eager to learn and collaborate on projects that blend logic with creativity.';
    const stats = aboutData?.stats || [
        { id: 'achievements', icon: 'BiAward', title: 'Achievements', subtitle: 'Academic Excellence' },
        { id: 'courses', icon: 'BiBookOpen', title: 'Courses', subtitle: '15+ Completed' },
        { id: 'projects', icon: 'BiCalculator', title: 'Projects', subtitle: '10 + Math Projects' },
    ];
    const cvLink = contactInfo?.cvLink || '#';

    return (
        <section className="about section" id="about">
            <h2 className="section__title">About Me</h2>
            <span className="section__subtitle">My introduction</span>

            <div className="about__container container grid">
                <img src={imgSrc} alt="Ayona Singh" className="about__img" />

                <div className="about__data">
                    <div className="about__info grid">
                        {stats.map((stat) => (
                            <div className="about__box" key={stat.id}>
                                {ICON_MAP[stat.icon] || <BiAward className="about__icon" />}
                                <h3 className="about__title">{stat.title}</h3>
                                <span className="about__subtitle">{stat.subtitle}</span>
                            </div>
                        ))}
                    </div>

                    <p className="about__description">{description}</p>

                    <a download="" href={cvLink} className="button button--flex">
                        Download CV <BiFileBlank className="button__icon" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default About;
