import React, { useEffect, useMemo, useState } from 'react';
import './Skills.css';
import {
    BiBadgeCheck,
    BiBrain,
    BiCodeAlt,
    BiPulse,
    BiPlanet
} from 'react-icons/bi';
import axios from 'axios';
import BASE_URL from '../../config/api';

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
        <div className="skills-modern__item">
            <div className="skills-modern__icon-wrap">
                <BiBadgeCheck className="skills-modern__icon-check" />
            </div>
            <div className="skills-modern__content">
                <div className="skills-modern__row">
                    <span className="skills-modern__name">{name}</span>
                    <span className={`skills-modern__level skills-modern__level--${colorClass}`}>
                        {level}
                    </span>
                </div>
                <div className="skills-modern__meter">
                    <div
                        className={`skills-modern__meter-fill skills-modern__meter-fill--${colorClass}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

const CategoryCard = ({ title, subtitle, icon, skills }) => {
    return (
        <div className="skills-modern__card">
            <div className="skills-modern__card-header">
                <div className="skills-modern__card-icon">{icon}</div>
                <div>
                    <h3 className="skills-modern__card-title">{title}</h3>
                    <p className="skills-modern__card-subtitle">{subtitle}</p>
                </div>
            </div>

            {skills.length === 0 ? (
                <p className="skills-modern__empty">
                    No skills added yet. Add them from your admin panel.
                </p>
            ) : (
                <div className="skills-modern__grid">
                    {skills.map((s) => (
                        <SkillPill key={s.id || s._id || s.name} name={s.name} level={s.level} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Skills = () => {
    const [skills, setSkills] = useState({ mathCore: [], tools: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        axios
            .get(`${BASE_URL}/skills`)
            .then((res) => {
                if (!mounted) return;
                const data = res.data || {};
                setSkills({
                    mathCore: data.mathCore || [],
                    tools: data.tools || [],
                });
            })
            .catch(() => {
                if (!mounted) return;
                setError('Unable to load skills right now.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const totalCount = useMemo(
        () => (skills.mathCore.length || 0) + (skills.tools.length || 0),
        [skills]
    );

    const advancedCount = useMemo(
        () =>
            [...(skills.mathCore || []), ...(skills.tools || [])].filter(
                (s) => s.level === 'Advanced'
            ).length,
        [skills]
    );

    return (
        <section className="skills-modern section" id="skills">
            <div className="container">
                <div className="skills-modern__intro">
                    <div className="skills-modern__badge-row">
                        <span className="skills-modern__badge">
                            <BiPulse /> Skills Matrix
                        </span>
                        <span className="skills-modern__badge skills-modern__badge--soft">
                            <BiPlanet /> Continuously growing
                        </span>
                    </div>

                    <h2 className="skills-modern__title">
                        Mathematics & Technical Skills
                    </h2>
                    <p className="skills-modern__subtitle">
                        A snapshot of my current strengths across core mathematics and the tools I use
                        daily in research, tutoring, and data analysis.
                    </p>

                    <div className="skills-modern__stats">
                        <div className="skills-modern__stat">
                            <span className="skills-modern__stat-number">{totalCount}</span>
                            <span className="skills-modern__stat-label">Total skills</span>
                        </div>
                        <div className="skills-modern__stat">
                            <span className="skills-modern__stat-number">
                                {advancedCount}
                            </span>
                            <span className="skills-modern__stat-label">Advanced level</span>
                        </div>
                        <div className="skills-modern__stat">
                            <span className="skills-modern__stat-number">
                                {skills.mathCore.length || 0}
                            </span>
                            <span className="skills-modern__stat-label">Math core</span>
                        </div>
                        <div className="skills-modern__stat">
                            <span className="skills-modern__stat-number">
                                {skills.tools.length || 0}
                            </span>
                            <span className="skills-modern__stat-label">Tools & tech</span>
                        </div>
                    </div>

                    {loading && (
                        <div className="skills-modern__loading">
                            <span className="skills-modern__spinner" />
                            <span>Loading your skills…</span>
                        </div>
                    )}
                    {error && !loading && (
                        <p className="skills-modern__error">{error}</p>
                    )}
                </div>

                {!loading && (
                    <div className="skills-modern__cards">
                        <CategoryCard
                            title="Mathematics Core"
                            subtitle="Foundational and advanced topics in pure and applied mathematics."
                            icon={<BiBrain />}
                            skills={skills.mathCore}
                        />

                        <CategoryCard
                            title="Tools & Technical"
                            subtitle="Programming languages, software and analytical workflows I use."
                            icon={<BiCodeAlt />}
                            skills={skills.tools}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
