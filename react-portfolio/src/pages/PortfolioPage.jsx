import React from 'react';
import '../pages/pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import Portfolio from '../components/Portfolio/Portfolio';
import Testimonial from '../components/Testimonial/Testimonial';

const PortfolioPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">Portfolio</h1>
                <p className="page-hero__subtitle">My academic projects & work</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>Portfolio</span>
                </div>
            </div>
            <Portfolio />
            <Testimonial />
        </div>
    );
};

export default PortfolioPage;
