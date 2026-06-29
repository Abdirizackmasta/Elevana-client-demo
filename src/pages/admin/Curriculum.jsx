import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, GripVertical, FileText, X, UploadCloud } from 'lucide-react';
import api from '../../api/axios.js';
import { formatDuration } from '../../utils/format.js';

const emptyLesson = {
  title: '', description: '', youtubeVideoId: '', durationMinutes: '', isPreview: false, resources: []
};

const Curriculum = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [lessonModal, setLessonModal] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [uploadingResource, setUploadingResource] = useState(false);

  const load = () => {
    api.get(`/courses/admin/${courseId}`).then(({ data }) => {
      setCourse(data.course);
      setSections(data.sections);
      setLessons(data.lessons);
    });
  };

  useEffect(() => { load(); }, [courseId]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    await api.post('/courses/sections', { course: courseId, title: newSectionTitle, order: sections.length + 1 });
    setNewSectionTitle('');
    load();
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its lessons?')) return;
    await api.delete(`/courses/sections/${sectionId}`);
    load();
  };

  const openNewLesson = (sectionId) => {
    setLessonForm({ ...emptyLesson, section: sectionId, course: courseId, order: lessons.filter((l) => l.section === sectionId).length + 1 });
    setLessonModal({ mode: 'create' });
  };

  const openEditLesson = (lesson) => {
    setLessonForm({ ...lesson, durationMinutes: lesson.durationMinutes || '' });
    setLessonModal({ mode: 'edit', id: lesson._id });
  };

  const handleLessonResourceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingResource(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLessonForm((prev) => ({
        ...prev,
        resources: [...(prev.resources || []), { title: file.name, fileUrl: data.url, fileType: file.name.split('.').pop() }]
      }));
    } finally {
      setUploadingResource(false);
    }
  };

  const removeResource = (idx) => {
    setLessonForm((prev) => ({ ...prev, resources: prev.resources.filter((_, i) => i !== idx) }));
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    const payload = { ...lessonForm, durationMinutes: Number(lessonForm.durationMinutes) || 0 };
    if (lessonModal.mode === 'create') {
      await api.post('/courses/lessons', payload);
    } else {
      await api.put(`/courses/lessons/${lessonModal.id}`, payload);
    }
    setLessonModal(null);
    load();
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    await api.delete(`/courses/lessons/${lessonId}`);
    load();
  };

  if (!course) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  return (
    <div>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/courses" className="icon-btn"><ArrowLeft size={15} /></Link>
          <h1>Curriculum &middot; {course.title}</h1>
        </div>
      </div>

      <form onSubmit={handleAddSection} className="card admin-panel" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <input
          className="input-field"
          placeholder="New section title (e.g. Getting Started)"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
        />
        <button className="btn btn-primary btn-sm"><Plus size={15} /> Add section</button>
      </form>

      {sections.map((section) => (
        <div key={section._id} className="card admin-panel" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--color-ink)' }}>
              <GripVertical size={15} color="var(--color-muted)" /> {section.title}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-outline btn-sm" onClick={() => openNewLesson(section._id)}><Plus size={14} /> Add lesson</button>
              <button className="icon-btn" onClick={() => handleDeleteSection(section._id)}><Trash2 size={15} /></button>
            </div>
          </div>

          {lessons.filter((l) => l.section === section._id).map((lesson) => (
            <div key={lesson._id} className="resource-item">
              <span className="resource-item-left">
                <FileText size={15} /> {lesson.title}
                <span className="text-muted" style={{ fontSize: 12 }}>&middot; {formatDuration(lesson.durationMinutes)}</span>
                {lesson.isPreview && <span className="badge badge-purple">Preview</span>}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="icon-btn" onClick={() => openEditLesson(lesson)}><Pencil size={14} /></button>
                <button className="icon-btn" onClick={() => handleDeleteLesson(lesson._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {lessons.filter((l) => l.section === section._id).length === 0 && (
            <p className="text-muted" style={{ fontSize: 13 }}>No lessons in this section yet.</p>
          )}
        </div>
      ))}

      {lessonModal && (
        <div className="modal-overlay" onClick={() => setLessonModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="modal-title">{lessonModal.mode === 'create' ? 'Add lesson' : 'Edit lesson'}</h2>
              <button className="icon-btn" onClick={() => setLessonModal(null)}><X size={15} /></button>
            </div>
            <form onSubmit={handleSaveLesson}>
              <div className="input-group">
                <label className="input-label">Lesson title</label>
                <input className="input-field" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea className="input-field" rows={2} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">YouTube video ID (unlisted video)</label>
                <input className="input-field" placeholder="e.g. dQw4w9WgXcQ" value={lessonForm.youtubeVideoId} onChange={(e) => setLessonForm({ ...lessonForm, youtubeVideoId: e.target.value })} required />
              </div>
              <div className="input-group">
                <label className="input-label">Duration (minutes)</label>
                <input className="input-field" type="number" value={lessonForm.durationMinutes} onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: e.target.value })} />
              </div>
              <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={lessonForm.isPreview} onChange={(e) => setLessonForm({ ...lessonForm, isPreview: e.target.checked })} />
                <label className="input-label" style={{ margin: 0 }}>Allow free preview</label>
              </div>

              <div className="input-group">
                <label className="input-label">Resources (PDF or downloadable files)</label>
                {(lessonForm.resources || []).map((r, i) => (
                  <div key={i} className="resource-item">
                    <span className="resource-item-left"><FileText size={14} /> {r.title}</span>
                    <button type="button" className="icon-btn" onClick={() => removeResource(i)}><X size={13} /></button>
                  </div>
                ))}
                <label className="btn btn-outline btn-sm" style={{ width: 'fit-content' }}>
                  <UploadCloud size={14} /> {uploadingResource ? 'Uploading...' : 'Upload file'}
                  <input type="file" hidden onChange={handleLessonResourceUpload} />
                </label>
              </div>

              <button className="btn btn-primary btn-block">Save lesson</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;
