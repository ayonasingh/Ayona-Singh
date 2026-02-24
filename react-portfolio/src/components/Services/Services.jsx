import React, { useState } from 'react';
import './Services.css';
import { BiRightArrowAlt, BiCheck, BiX, BiCalculator, BiBarChartAlt2, BiBook } from "react-icons/bi";

const Services = () => {
    const [toggleState, setToggleState] = useState(0);

    const toggleTab = (index) => {
        setToggleState(index)
    }

    return (
        <section className="services section" id="services">
            <h2 className="section__title">Services</h2>
            <span className="section__subtitle">What I offer</span>

            <div className="services__container container grid">
                <div className="services__content">
                    <div>
                        <BiCalculator className="services__icon" />
                        <h3 className="services__title">Math <br /> Tutoring</h3>
                    </div>

                    <span className="services__button" onClick={() => toggleTab(1)}>View More <BiRightArrowAlt className="services__button-icon" /></span>

                    <div className={toggleState === 1 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <BiX className="services__modal-close" onClick={() => toggleTab(0)} />

                            <h3 className="services__modal-title">Math Tutoring</h3>
                            <p className="services__modal-description">Personalized math tutoring for school and college students, covering all major topics.</p>

                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Calculus & Algebra tutoring (Grades 8–12).</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Competitive exam preparation (JEE, Olympiads).</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Concept clarity through step-by-step explanations.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Practice problem sets and home assignments.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <BiBarChartAlt2 className="services__icon" />
                        <h3 className="services__title">Data <br /> Analysis</h3>
                    </div>

                    <span className="services__button" onClick={() => toggleTab(2)}>View More <BiRightArrowAlt className="services__button-icon" /></span>

                    <div className={toggleState === 2 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <BiX className="services__modal-close" onClick={() => toggleTab(0)} />

                            <h3 className="services__modal-title">Data Analysis</h3>
                            <p className="services__modal-description">Statistical analysis and data interpretation using Python, R, and Excel.</p>

                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Descriptive & inferential statistical analysis.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Data visualization using charts and graphs.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Report writing and data interpretation.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Python / Excel based data projects.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="services__content">
                    <div>
                        <BiBook className="services__icon" />
                        <h3 className="services__title">Academic <br /> Writing</h3>
                    </div>

                    <span className="services__button" onClick={() => toggleTab(3)}>View More <BiRightArrowAlt className="services__button-icon" /></span>

                    <div className={toggleState === 3 ? "services__modal active-modal" : "services__modal"}>
                        <div className="services__modal-content">
                            <BiX className="services__modal-close" onClick={() => toggleTab(0)} />

                            <h3 className="services__modal-title">Academic Writing</h3>
                            <p className="services__modal-description">Math-oriented academic writing, LaTeX typesetting, and research documentation.</p>

                            <ul className="services__modal-services grid">
                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">LaTeX document formatting for math papers.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Writing and editing math-based assignments.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Research summary and literature review.</p>
                                </li>

                                <li className="services__modal-service">
                                    <BiCheck className="services__modal-icon" />
                                    <p className="services__modal-info">Proofreading mathematical proofs and reports.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services;
