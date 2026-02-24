import React from 'react';
import '../pages/pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import Skills from '../components/Skills/Skills';

const SkillsPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">Skills</h1>
                <p className="page-hero__subtitle">My mathematical & technical proficiency</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>Skills</span>
                </div>
            </div>
            <Skills />
        </div>
    );
};

export default SkillsPage;
