import React from 'react';
import './pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import About from '../components/About/About';

const AboutPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">About Me</h1>
                <p className="page-hero__subtitle">My journey, skills & experience</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>About</span>
                </div>
            </div>
            <About />
        </div>
    );
};

export default AboutPage;
