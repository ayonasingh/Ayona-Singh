import React, { useEffect, useState } from 'react';
import './About.css';
import AboutImgFallback from '../../assets/ayona_about.jpg';
import { 
    BiFileBlank, 
    BiAward, 
    BiBookOpen, 
    BiCalculator,
    BiBadgeCheck,
    BiBriefcase,
    BiBook
} from 'react-icons/bi';
import axios from 'axios';
import BASE_URL from '../../config/api';
import ScrollReveal from '../ScrollReveal/ScrollReveal';

const ICON_MAP = {
    BiAward: <BiAward className="about__icon" />,
    BiBookOpen: <BiBookOpen className="about__icon" />,
    BiCalculator: <BiCalculator className="about__icon" />,
};

const LEVEL_COLORS = {
    Advanced: 'advanced',
    Intermediate: 'intermediate',
    Basic: 'basic',
};

const levelToPercent = (level) => {
    if (level === 'Advanced') return 95;
    if (level === 'Intermediate') return 75;
    return 55;
};

const SkillPill = ({ name, level }) => {
    const colorClass = LEVEL_COLORS[level] || 'basic';
    const percent = levelToPercent(level);

    return (
        <div className="about-skills__item">
            <div className="about-skills__icon-wrap">
                <BiBadgeCheck className="about-skills__icon-check" />
            </div>
            <div className="about-skills__content">
                <div className="about-skills__row">
                    <span className="about-skills__name">{name}</span>
                    <span className={`about-skills__level about-skills__level--${colorClass}`}>
                        {level}
                    </span>
                </div>
                <div className="about-skills__meter">
                    <div
                        className={`about-skills__meter-fill about-skills__meter-fill--${colorClass}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [contactInfo, setContactInfo] = useState(null);
    const [skills, setSkills] = useState({ mathCore: [], tools: [] });
    const [qualification, setQualification] = useState({ education: [], experience: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axios.get(`${BASE_URL}/about`),
            axios.get(`${BASE_URL}/contact-info`),
            axios.get(`${BASE_URL}/skills`),
            axios.get(`${BASE_URL}/qualification`),
        ]).then(([aboutRes, contactRes, skillsRes, qualificationRes]) => {
            setAboutData(aboutRes.data);
            setContactInfo(contactRes.data);
            setSkills(skillsRes.data || { mathCore: [], tools: [] });
            setQualification(qualificationRes.data || { education: [], experience: [] });
        }).catch(() => {
            // fallback silently
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const imgSrc = aboutData?.image || AboutImgFallback;
    const description = aboutData?.description || 'I am Ayona Singh, a passionate Mathematics student with a strong foundation in calculus, statistics, linear algebra, and mathematical modeling. I love solving complex problems, analyzing data, and applying mathematical reasoning to real-world challenges. I am always eager to learn and collaborate on projects that blend logic with creativity.';
    const stats = aboutData?.stats || [
        { id: 'achievements', icon: 'BiAward', title: 'Achievements', subtitle: 'Academic Excellence' },
        { id: 'courses', icon: 'BiBookOpen', title: 'Courses', subtitle: '15+ Completed' },
        { id: 'projects', icon: 'BiCalculator', title: 'Projects', subtitle: '10 + Math Projects' },
    ];
    const cvLink = contactInfo?.cvLink || '#';

    return (
        <section className="about-modern section" id="about">
            <div className="container">
                {/* Introduction Section */}
                <div className="about-modern__intro">
                    <ScrollReveal animation="scale" delay={0} threshold={0.2}>
                        <img src={imgSrc} alt="Ayona Singh" className="about-modern__img" />
                    </ScrollReveal>

                    <div className="about-modern__content">
                        <div className="about-modern__stats-grid">
                            {stats.map((stat, index) => (
                                <ScrollReveal 
                                    key={stat.id}
                                    animation="fade-up"
                                    delay={index * 100}
                                    threshold={0.2}
                                >
                                    <div className="about-modern__stat-box">
                                        {ICON_MAP[stat.icon] || <BiAward className="about__icon" />}
                                        <h3 className="about-modern__stat-title">{stat.title}</h3>
                                        <span className="about-modern__stat-subtitle">{stat.subtitle}</span>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        <ScrollReveal animation="fade-left" delay={200} threshold={0.2}>
                            <p className="about-modern__description">{description}</p>
                        </ScrollReveal>

                        <ScrollReveal animation="fade-up" delay={300} threshold={0.2}>
                            <a download="" href={cvLink} className="button button--flex">
                                Download CV <BiFileBlank className="button__icon" />
                            </a>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="about-modern__section">
                    <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
                        <h2 className="about-modern__section-title">Skills & Expertise</h2>
                        <p className="about-modern__section-subtitle">
                            My technical proficiency across mathematics and tools
                        </p>
                    </ScrollReveal>

                    {loading ? (
                        <div className="about-modern__loading">
                            <span className="about-modern__spinner" />
                            <span>Loading skills...</span>
                        </div>
                    ) : (
                        <div className="about-modern__skills-grid">
                            <ScrollReveal animation="fade-right" delay={100} threshold={0.2}>
                                <div className="about-modern__card">
                                    <div className="about-modern__card-header">
                                        <BiBook className="about-modern__card-icon" />
                                        <div>
                                            <h3 className="about-modern__card-title">Mathematics Core</h3>
                                            <p className="about-modern__card-subtitle">
                                                {skills.mathCore?.length || 0} skills
                                            </p>
                                        </div>
                                    </div>
                                    <div className="about-modern__skills-list">
                                        {(skills.mathCore || []).map((skill) => (
                                            <SkillPill 
                                                key={skill.id || skill._id || skill.name} 
                                                name={skill.name} 
                                                level={skill.level} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal animation="fade-left" delay={200} threshold={0.2}>
                                <div className="about-modern__card">
                                    <div className="about-modern__card-header">
                                        <BiCalculator className="about-modern__card-icon" />
                                        <div>
                                            <h3 className="about-modern__card-title">Tools & Technical</h3>
                                            <p className="about-modern__card-subtitle">
                                                {skills.tools?.length || 0} skills
                                            </p>
                                        </div>
                                    </div>
                                    <div className="about-modern__skills-list">
                                        {(skills.tools || []).map((skill) => (
                                            <SkillPill 
                                                key={skill.id || skill._id || skill.name} 
                                                name={skill.name} 
                                                level={skill.level} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    )}
                </div>

                {/* Education & Experience Section */}
                <div className="about-modern__section">
                    <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
                        <h2 className="about-modern__section-title">Education & Experience</h2>
                        <p className="about-modern__section-subtitle">
                            My academic journey and professional experience
                        </p>
                    </ScrollReveal>

                    <div className="about-modern__timeline-grid">
                        {/* Education */}
                        <ScrollReveal animation="fade-right" delay={100} threshold={0.2}>
                            <div className="about-modern__timeline-section">
                                <div className="about-modern__timeline-header">
                                    <BiBook className="about-modern__timeline-icon" />
                                    <h3 className="about-modern__timeline-title">Education</h3>
                                </div>
                                <div className="about-modern__timeline">
                                    {(qualification.education || []).slice(0, 2).map((item, index) => (
                                        <div key={item.id || index} className="about-modern__timeline-item">
                                            <div className="about-modern__timeline-marker" />
                                            <div className="about-modern__timeline-content">
                                                <span className="about-modern__timeline-period">{item.period}</span>
                                                <h4 className="about-modern__timeline-item-title">{item.title}</h4>
                                                <p className="about-modern__timeline-institution">{item.institution}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Experience */}
                        <ScrollReveal animation="fade-left" delay={200} threshold={0.2}>
                            <div className="about-modern__timeline-section">
                                <div className="about-modern__timeline-header">
                                    <BiBriefcase className="about-modern__timeline-icon" />
                                    <h3 className="about-modern__timeline-title">Experience</h3>
                                </div>
                                <div className="about-modern__timeline">
                                    {(qualification.experience || []).slice(0, 2).map((item, index) => (
                                        <div key={item.id || index} className="about-modern__timeline-item">
                                            <div className="about-modern__timeline-marker" />
                                            <div className="about-modern__timeline-content">
                                                <span className="about-modern__timeline-period">{item.period}</span>
                                                <h4 className="about-modern__timeline-item-title">{item.title}</h4>
                                                <p className="about-modern__timeline-institution">{item.institution}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
