import React, { useEffect, useState } from 'react';
import './Skills.css';
import { BiBadgeCheck } from 'react-icons/bi';
import axios from 'axios';
import BASE_URL from '../../config/api';

const DEFAULT_MATH = [
    { id: 's1', name: 'Calculus', level: 'Advanced' },
    { id: 's2', name: 'Linear Algebra', level: 'Advanced' },
    { id: 's3', name: 'Statistics', level: 'Intermediate' },
    { id: 's4', name: 'Number Theory', level: 'Intermediate' },
    { id: 's5', name: 'Differential Equations', level: 'Intermediate' },
    { id: 's6', name: 'Real Analysis', level: 'Basic' },
];

const DEFAULT_TOOLS = [
    { id: 't1', name: 'Python', level: 'Intermediate' },
    { id: 't2', name: 'MATLAB', level: 'Basic' },
    { id: 't3', name: 'LaTeX', level: 'Intermediate' },
    { id: 't4', name: 'MS Excel', level: 'Advanced' },
    { id: 't5', name: 'Data Analysis', level: 'Intermediate' },
];

const SkillItem = ({ name, level }) => (
    <div className="skills__data">
        <BiBadgeCheck className="bx bx-badge-check" />
        <div>
            <h3 className="skills__name">{name}</h3>
            <span className="skills__level">{level}</span>
        </div>
    </div>
);

const SkillGroup = ({ items }) => {
    const half = Math.ceil(items.length / 2);
    const col1 = items.slice(0, half);
    const col2 = items.slice(half);
    return (
        <div className="skills__box">
            <div className="skills__group">
                {col1.map((s) => <SkillItem key={s.id} name={s.name} level={s.level} />)}
            </div>
            <div className="skills__group">
                {col2.map((s) => <SkillItem key={s.id} name={s.name} level={s.level} />)}
            </div>
        </div>
    );
};

const Skills = () => {
    const [mathCore, setMathCore] = useState(DEFAULT_MATH);
    const [tools, setTools] = useState(DEFAULT_TOOLS);

    useEffect(() => {
        axios.get(`${BASE_URL}/skills`)
            .then((res) => {
                if (res.data.mathCore) setMathCore(res.data.mathCore);
                if (res.data.tools) setTools(res.data.tools);
            })
            .catch(() => { /* use defaults */ });
    }, []);

    return (
        <section className="skills section" id="skills">
            <h2 className="section__title">Skills</h2>
            <span className="section__subtitle">My mathematical level</span>

            <div className="skills__container container grid">
                <div className="skills__content">
                    <h3 className="skills__title">Mathematics Core</h3>
                    <SkillGroup items={mathCore} />
                </div>

                <div className="skills__content">
                    <h3 className="skills__title">Tools &amp; Technical</h3>
                    <SkillGroup items={tools} />
                </div>
            </div>
        </section>
    );
};

export default Skills;
