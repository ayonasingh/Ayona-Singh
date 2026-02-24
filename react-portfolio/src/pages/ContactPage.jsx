import React from 'react';
import '../pages/pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import Contact from '../components/Contact/Contact';

const ContactPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">Contact</h1>
                <p className="page-hero__subtitle">Get in touch with me</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>Contact</span>
                </div>
            </div>
            <Contact />
        </div>
    );
};

export default ContactPage;
