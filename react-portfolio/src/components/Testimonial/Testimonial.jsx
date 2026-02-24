import React from 'react';
import "./Testimonial.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from 'swiper/modules';
import AyonaImg from "../../assets/ayona_profile.jpg";
import AyonaImg2 from "../../assets/ayona_about.jpg";
import Image3 from "../../assets/testimonial3.jpg";

const Testimonial = () => {
    return (
        <section className="testimonial container section">
            <h2 className="section__title">Testimonials</h2>
            <span className="section__subtitle">What people say</span>

            <Swiper className="testimonial__container"
                modules={[Pagination]}
                spaceBetween={24}
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
                <SwiperSlide className="testimonial__card">
                    <img src={AyonaImg} alt="Rahul Sharma" className="testimonial__img" />

                    <h3 className="testimonial__name">Rahul Sharma</h3>
                    <p className="testimonial__description">
                        Ayona helped me understand complex calculus concepts so clearly. Her patient teaching style and deep understanding of mathematics made a huge difference in my studies.
                    </p>
                </SwiperSlide>

                <SwiperSlide className="testimonial__card">
                    <img src={AyonaImg2} alt="Priya Mehta" className="testimonial__img" />

                    <h3 className="testimonial__name">Priya Mehta</h3>
                    <p className="testimonial__description">
                        Excellent at breaking down difficult math problems. Ayona's analytical approach and clarity in explaining linear algebra helped me ace my semester exams.
                    </p>
                </SwiperSlide>

                <SwiperSlide className="testimonial__card">
                    <img src={Image3} alt="Arjun Patel" className="testimonial__img" />

                    <h3 className="testimonial__name">Arjun Patel</h3>
                    <p className="testimonial__description">
                        Ayona's statistical analysis work on our college project was outstanding. Her ability to interpret data and present findings clearly was truly impressive.
                    </p>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default Testimonial;
