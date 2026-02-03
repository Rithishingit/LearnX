import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        thumbnail: '',
        sections: [
            {
                title: 'Introduction',
                content: [
                    { title: 'Welcome to the course', type: 'video', url: '' }
                ]
            }
        ]
    });

    const addSection = () => {
        setFormData({
            ...formData,
            sections: [...formData.sections, { title: '', content: [] }]
        });
    };

    const removeSection = (sIdx) => {
        const newSections = formData.sections.filter((_, idx) => idx !== sIdx);
        setFormData({ ...formData, sections: newSections });
    };

    const addLesson = (sIdx) => {
        const newSections = [...formData.sections];
        newSections[sIdx].content.push({ title: '', type: 'video', url: '' });
        setFormData({ ...formData, sections: newSections });
    };

    const removeLesson = (sIdx, lIdx) => {
        const newSections = [...formData.sections];
        newSections[sIdx].content = newSections[sIdx].content.filter((_, idx) => idx !== lIdx);
        setFormData({ ...formData, sections: newSections });
    };

    const handleLessonChange = (sIdx, lIdx, field, value) => {
        const newSections = [...formData.sections];
        newSections[sIdx].content[lIdx][field] = value;
        setFormData({ ...formData, sections: newSections });
    };

    const handleSectionChange = (sIdx, value) => {
        const newSections = [...formData.sections];
        newSections[sIdx].title = value;
        setFormData({ ...formData, sections: newSections });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/courses', formData);
            toast.success('Course created successfully!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Create New Course</h2>
                <button onClick={() => navigate('/admin')} className="glass" style={{ padding: '0.5rem 1rem' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Basic Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Course Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                placeholder="e.g. Master React in 30 Days"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                placeholder="What will students learn?"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                placeholder="999"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                placeholder="e.g. Web Development"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Thumbnail URL</label>
                            <input
                                type="text"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--primary)' }}>Course Curriculum</h3>
                        <button type="button" onClick={addSection} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                            <Plus size={18} /> Add Section
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {formData.sections.map((section, sIdx) => (
                            <div key={sIdx} style={{ padding: '1.5rem', border: '1px solid var(--surface-light)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Section Title"
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(sIdx, e.target.value)}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white', fontSize: '1.1rem', fontWeight: 600 }}
                                    />
                                    <button type="button" onClick={() => removeSection(sIdx)} className="btn-primary" style={{ background: 'var(--error)', padding: '0.8rem' }}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginLeft: '2rem' }}>
                                    {section.content.map((lesson, lIdx) => (
                                        <div key={lIdx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Lesson Title"
                                                value={lesson.title}
                                                onChange={(e) => handleLessonChange(sIdx, lIdx, 'title', e.target.value)}
                                                style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Video URL"
                                                value={lesson.url}
                                                onChange={(e) => handleLessonChange(sIdx, lIdx, 'url', e.target.value)}
                                                style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', background: 'var(--surface)', border: '1px solid var(--surface-light)', color: 'white' }}
                                            />
                                            <button type="button" onClick={() => removeLesson(sIdx, lIdx)} style={{ color: 'var(--error)', background: 'none' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addLesson(sIdx)} style={{ alignSelf: 'flex-start', color: 'var(--primary)', background: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                                        <Plus size={16} /> Add Lesson
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ padding: '1.2rem', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={24} /> Create Course</>}
                </button>
            </form>
        </div>
    );
};

export default CreateCourse;
