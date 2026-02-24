import React from 'react';
import '../pages/pages.css';
import { Link } from 'react-router-dom';
import { BiChevronRight } from 'react-icons/bi';
import Blogs from '../components/Blogs/Blogs';

const BlogsPage = () => {
    return (
        <div className="page-wrapper">
            <div className="page-hero">
                <h1 className="page-hero__title">Blogs</h1>
                <p className="page-hero__subtitle">My thoughts, learnings & Math insights</p>
                <div className="page-hero__breadcrumb">
                    <Link to="/">Home</Link>
                    <BiChevronRight />
                    <span>Blogs</span>
                </div>
            </div>
            <Blogs />
        </div>
    );
};

export default BlogsPage;
