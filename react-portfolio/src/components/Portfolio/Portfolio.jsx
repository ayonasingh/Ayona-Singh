import React, { useEffect, useState } from 'react';
import './Portfolio.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Img1 from '../../assets/portfolio1.jpg';
import Img2 from '../../assets/portfolio2.jpg';
import Img3 from '../../assets/portfolio3.jpg';
import { BiRightArrowAlt } from 'react-icons/bi';
import axios from 'axios';
import BASE_URL from '../../config/api';

const FALLBACK_IMGS = [Img1, Img2, Img3];

const FALLBACK_PROJECTS = [
    { id: 1, title: 'Statistical Analysis Project', description: 'Analyzed real-world datasets using descriptive and inferential statistics with Python and Excel.', link: '#' },
    { id: 2, title: 'Linear Algebra Research', description: 'Explored matrix transformations, eigenvalues, and their applications in real-world problems.', link: '#' },
    { id: 3, title: 'Calculus & Modeling', description: 'Built mathematical models using differential equations to simulate population and growth dynamics.', link: '#' },
];

const Portfolio = () => {
    const [projects, setProjects] = useState(FALLBACK_PROJECTS);

    useEffect(() => {
        axios.get(`${BASE_URL}/portfolio`)
            .then((res) => {
                if (res.data && res.data.length > 0) setProjects(res.data);
            })
            .catch(() => { /* use fallback */ });
    }, []);

    const getImage = (project, index) => {
        if (project.image) return project.image;
        return FALLBACK_IMGS[index % FALLBACK_IMGS.length];
    };

    return (
        <section className="portfolio section" id="portfolio">
            <h2 className="section__title">Portfolio</h2>
            <span className="section__subtitle">My academic projects</span>

            <Swiper
                className="portfolio__container container"
                modules={[Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                loop={projects.length > 1}
                grabCursor={true}
                pagination={{ clickable: true }}
                breakpoints={{
                    576: { slidesPerView: 2 },
                    768: { slidesPerView: 2, spaceBetween: 48 },
                }}
            >
                {projects.map((project, index) => (
                    <SwiperSlide className="portfolio__content" key={project.id || project._id}>
                        <img src={getImage(project, index)} alt={project.title} className="portfolio__img" />
                        <div className="portfolio__data">
                            <h3 className="portfolio__title">{project.title}</h3>
                            <p className="portfolio__description">{project.description}</p>
                            <a
                                href={project.link || '#'}
                                className="button button--flex button--small portfolio__button"
                                target={project.link && project.link !== '#' ? '_blank' : '_self'}
                                rel="noreferrer"
                            >
                                Demo <BiRightArrowAlt className="button__icon" />
                            </a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Portfolio;
