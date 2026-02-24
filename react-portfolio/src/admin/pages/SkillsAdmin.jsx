import React, { useEffect, useState } from 'react';
import { getSkills, updateSkills } from '../api';
import toast from 'react-hot-toast';
import { BiSave, BiPlus, BiTrash } from 'react-icons/bi';

const LEVELS = ['Basic', 'Intermediate', 'Advanced'];

const SkillsAdmin = () => {
    const [skills, setSkills] = useState({ mathCore: [], tools: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getSkills()
            .then((res) => setSkills(res.data))
            .catch(() => toast.error('Failed to load skills'))
            .finally(() => setLoading(false));
    }, []);

    const addSkill = (category) => {
        const newSkill = { id: `new_${Date.now()}`, name: '', level: 'Intermediate' };
        setSkills((s) => ({ ...s, [category]: [...(s[category] || []), newSkill] }));
    };

    const updateSkill = (category, index, key, value) => {
        const updated = [...skills[category]];
        updated[index] = { ...updated[index], [key]: value };
        setSkills((s) => ({ ...s, [category]: updated }));
    };

    const removeSkill = (category, index) => {
        const updated = skills[category].filter((_, i) => i !== index);
        setSkills((s) => ({ ...s, [category]: updated }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSkills(skills);
            toast.success('Skills updated! ✨');
        } catch {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="admin-spinner" />;

    const renderCategory = (label, categoryKey) => (
        <div className="admin-card">
            <div className="skills-category-header">
                <h2 className="admin-section-subtitle">{label}</h2>
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => addSkill(categoryKey)}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.813rem' }}>
                    <BiPlus /> Add Skill
                </button>
            </div>

            {(skills[categoryKey] || []).length === 0 ? (
                <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.813rem' }}>No skills yet. Add one!</p>
            ) : (
                <div className="skills-list">
                    {skills[categoryKey].map((skill, i) => (
                        <div className="skills-item" key={skill.id}>
                            <input
                                className="admin-form__input"
                                value={skill.name}
                                onChange={(e) => updateSkill(categoryKey, i, 'name', e.target.value)}
                                placeholder="Skill name"
                                style={{ flex: 1 }}
                            />
                            <select
                                className="admin-form__select"
                                value={skill.level}
                                onChange={(e) => updateSkill(categoryKey, i, 'level', e.target.value)}
                                style={{ width: '140px' }}
                            >
                                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <button type="button" className="admin-btn admin-btn--danger"
                                onClick={() => removeSkill(categoryKey, i)}
                                style={{ padding: '0.5rem 0.65rem' }}>
                                <BiTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div>
            <div className="admin-page__header">
                <h1 className="admin-page__title">⚙️ Skills</h1>
                <p className="admin-page__subtitle">Manage your skill sets and proficiency levels</p>
            </div>

            <form onSubmit={handleSave}>
                <div className="skills-admin-grid">
                    {renderCategory('📐 Mathematics Core Skills', 'mathCore')}
                    {renderCategory('🛠️ Tools & Technical Skills', 'tools')}
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                    <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                        <BiSave /> {saving ? 'Saving...' : 'Save Skills'}
                    </button>
                </div>
            </form>

            <style>{`
        .skills-admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media(max-width: 768px) { .skills-admin-grid { grid-template-columns: 1fr; } }
        .skills-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .admin-section-subtitle {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
        }
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .skills-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .skills-item .admin-form__input,
        .skills-item .admin-form__select {
          margin-bottom: 0;
        }
      `}</style>
        </div>
    );
};

export default SkillsAdmin;
