import React, { useState, useEffect } from 'react';
import './Qualification.css';
import { BiBriefcaseAlt, BiCalendar, BiBook } from "react-icons/bi";
import axios from 'axios';
import BASE_URL from '../../config/api';

const Qualification = () => {
    const [toggleState, setToggleState] = useState(1);
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/qualification`)
            .then((res) => {
                setEducation(res.data.education || []);
                setExperience(res.data.experience || []);
            })
            .catch(() => {
                setEducation([
                    { id: 'e1', title: 'B.Sc. Mathematics (Hons.)', institution: 'University - India', period: '2022 - Present' },
                    { id: 'e2', title: 'Higher Secondary (12th)', institution: 'CBSE Board - India', period: '2020 - 2022' },
                    { id: 'e3', title: 'Secondary School (10th)', institution: 'CBSE Board - India', period: '2018 - 2020' },
                ]);
                setExperience([
                    { id: 'w1', title: 'Math Tutor', institution: 'Private Coaching - India', period: '2023 - Present' },
                    { id: 'w2', title: 'Research Assistant', institution: 'University Maths Dept.', period: '2023' },
                    { id: 'w3', title: 'Data Analyst Intern', institution: 'Online / Remote', period: '2022' },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleTab = (index) => setToggleState(index);

    const renderItems = (items) => {
        if (!items || items.length === 0) {
            return (
                <div className="qualification__data">
                    <div><p style={{ color: 'var(--text-color-light)', fontSize: '0.9rem' }}>No entries yet.</p></div>
                    <div><span className="qualification__rounder"></span></div>
                </div>
            );
        }
        return items.map((item, idx) => {
            const isRight = idx % 2 === 1;
            return (
                <div className="qualification__data" key={item.id || idx}>
                    {isRight ? (
                        <>
                            <div></div>
                            <div>
                                <span className="qualification__rounder"></span>
                                {idx < items.length - 1 && <span className="qualification__line"></span>}
                            </div>
                            <div>
                                <h3 className="qualification__title">{item.title}</h3>
                                <span className="qualification__subtitle">{item.institution}</span>
                                <div className="qualification__calendar">
                                    <BiCalendar /> {item.period}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="qualification__title">{item.title}</h3>
                                <span className="qualification__subtitle">{item.institution}</span>
                                <div className="qualification__calendar">
                                    <BiCalendar /> {item.period}
                                </div>
                            </div>
                            <div>
                                <span className="qualification__rounder"></span>
                                {idx < items.length - 1 && <span className="qualification__line"></span>}
                            </div>
                        </>
                    )}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <section className="qualification section">
                <h2 className="section__title">Qualification</h2>
                <span className="section__subtitle">My personal journey</span>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-light)' }}>Loading...</div>
            </section>
        );
    }

    return (
        <section className="qualification section">
            <h2 className="section__title">Qualification</h2>
            <span className="section__subtitle">My personal journey</span>

            <div className="qualification__container container">
                <div className="qualification__tabs">
                    <div
                        className={toggleState === 1 ? "qualification__button qualification__active button--flex" : "qualification__button button--flex"}
                        onClick={() => toggleTab(1)}
                    >
                        <BiBook className="qualification__icon" />
                        Education
                    </div>

                    <div
                        className={toggleState === 2 ? "qualification__button qualification__active button--flex" : "qualification__button button--flex"}
                        onClick={() => toggleTab(2)}
                    >
                        <BiBriefcaseAlt className="qualification__icon" />
                        Work Experience
                    </div>
                </div>

                <div className="qualification__sections">
                    <div className={toggleState === 1 ? "qualification__content qualification__active" : "qualification__content"}>
                        {renderItems(education)}
                    </div>
                    <div className={toggleState === 2 ? "qualification__content qualification__active" : "qualification__content"}>
                        {renderItems(experience)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Qualification;
