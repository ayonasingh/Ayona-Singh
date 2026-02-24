import React from 'react';
import '../pages/pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import About from '../components/About/About';
import Qualification from '../components/Qualification/Qualification';

const AboutPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">About Me</h1>
                <p className="page-hero__subtitle">Know more about my journey</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>About</span>
                </div>
            </div>
            <About />
            <Qualification />
        </div>
    );
};

export default AboutPage;
