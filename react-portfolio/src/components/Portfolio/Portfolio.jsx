import React from 'react';
import "./Portfolio.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from 'swiper/modules';
import Img1 from "../../assets/portfolio1.jpg";
import Img2 from "../../assets/portfolio2.jpg";
import Img3 from "../../assets/portfolio3.jpg";
import { BiRightArrowAlt } from "react-icons/bi";

const Portfolio = () => {
    return (
        <section className="portfolio section" id="portfolio">
            <h2 className="section__title">Portfolio</h2>
            <span className="section__subtitle">My academic projects</span>

            <Swiper className="portfolio__container container"
                modules={[Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                grabCursor={true}
                pagination={{ clickable: true }}
                breakpoints={{
                    576: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 48,
                    },
                }}
            >
                <SwiperSlide className="portfolio__content">
                    <img src={Img1} alt="" className="portfolio__img" />

                    <div className="portfolio__data">
                        <h3 className="portfolio__title">Statistical Analysis Project</h3>
                        <p className="portfolio__description">Analyzed real-world datasets using descriptive and inferential statistics with Python and Excel.</p>
                        <a href="#" className="button button--flex button--small portfolio__button">
                            Demo <BiRightArrowAlt className="button__icon" />
                        </a>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="portfolio__content">
                    <img src={Img2} alt="" className="portfolio__img" />

                    <div className="portfolio__data">
                        <h3 className="portfolio__title">Linear Algebra Research</h3>
                        <p className="portfolio__description">Explored matrix transformations, eigenvalues, and their applications in real-world problems.</p>
                        <a href="#" className="button button--flex button--small portfolio__button">
                            Demo <BiRightArrowAlt className="button__icon" />
                        </a>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="portfolio__content">
                    <img src={Img3} alt="" className="portfolio__img" />

                    <div className="portfolio__data">
                        <h3 className="portfolio__title">Calculus & Modeling</h3>
                        <p className="portfolio__description">Built mathematical models using differential equations to simulate population and growth dynamics.</p>
                        <a href="#" className="button button--flex button--small portfolio__button">
                            Demo <BiRightArrowAlt className="button__icon" />
                        </a>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default Portfolio;
