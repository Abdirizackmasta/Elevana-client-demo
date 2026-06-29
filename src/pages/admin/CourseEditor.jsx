import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Save } from 'lucide-react';
import api from '../../api/axios.js';

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  category: '',
  price: '',
  discountPrice: '',
  level: 'beginner',
  language: 'English',
  thumbnail: '',
  learningOutcomes: '',
  requirements: '',
  instructorName: 'Elevana Hub',
  instructorTitle: '',
  instructorBio: ''
};

const CourseEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/admin/${id}`).then(({ data }) => {
      const c = data.course;
      setForm({
        title: c.title,
        subtitle: c.subtitle || '',
        description: c.description,
        category: c.category?._id || '',
        price: c.price,
        discountPrice: c.discountPrice || '',
        level: c.level,
        language: c.language,
        thumbnail: c.thumbnail,
        learningOutcomes: (c.learningOutcomes || []).join('\n'),
        requirements: (c.requirements || []).join('\n'),
        instructorName: c.instructor?.name || '',
        instructorTitle: c.instructor?.title || '',
        instructorBio: c.instructor?.bio || ''
      });
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload/thumbnails', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((prev) => ({ ...prev, thumbnail: data.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      level: form.level,
      language: form.language,
      thumbnail: form.thumbnail,
      learningOutcomes: form.learningOutcomes.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      instructor: { name: form.instructorName, title: form.instructorTitle, bio: form.instructorBio }
    };
    try {
      if (isEdit) {
        await api.put(`/courses/admin/${id}`, payload);
      } else {
        const { data } = await api.post('/courses/admin', payload);
        return navigate(`/admin/courses/${data.course._id}/curriculum`);
      }
      navigate('/admin/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/courses" className="icon-btn"><ArrowLeft size={15} /></Link>
          <h1>{isEdit ? 'Edit course' : 'New course'}</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card form-card" style={{ maxWidth: 720 }}>
        <div className="input-group">
          <label className="input-label">Course title</label>
          <input className="input-field" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label className="input-label">Subtitle</label>
          <input className="input-field" name="subtitle" value={form.subtitle} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea className="input-field" rows={4} name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label className="input-label">Thumbnail</label>
          {form.thumbnail && <img src={form.thumbnail} alt="Thumbnail preview" className="thumb-preview" />}
          <label className="btn btn-outline btn-sm" style={{ width: 'fit-content' }}>
            <UploadCloud size={15} /> {uploading ? 'Uploading...' : 'Upload image'}
            <input type="file" accept="image/*" hidden onChange={handleThumbnailUpload} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select className="input-field" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Level</label>
            <select className="input-field" name="level" value={form.level} onChange={handleChange}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Price (KSh)</label>
            <input className="input-field" type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="input-label">Discount price (optional)</label>
            <input className="input-field" type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">What students will learn (one per line)</label>
          <textarea className="input-field" rows={4} name="learningOutcomes" value={form.learningOutcomes} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="input-label">Requirements (one per line)</label>
          <textarea className="input-field" rows={3} name="requirements" value={form.requirements} onChange={handleChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div className="input-group">
            <label className="input-label">Instructor name</label>
            <input className="input-field" name="instructorName" value={form.instructorName} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Instructor title</label>
            <input className="input-field" name="instructorTitle" value={form.instructorTitle} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary" disabled={saving}>
          {saving ? <span className="spinner" /> : <Save size={15} />} {isEdit ? 'Save changes' : 'Create course'}
        </button>
      </form>
    </div>
  );
};

export default CourseEditor;
