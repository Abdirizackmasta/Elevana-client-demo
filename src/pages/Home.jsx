import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, BookOpen, Award, Film, Palette, Megaphone, Briefcase } from 'lucide-react';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const categoryIcons = {
  'Video Editing': Film,
  Design: Palette,
  Marketing: Megaphone,
  Business: Briefcase
};

const testimonials = [
  {
    name: 'Amina Yusuf',
    role: 'Freelance Video Editor, Nairobi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
    quote:
      'The Premiere Pro course took me from barely knowing the timeline to delivering paid edits for clients within a month. Every lesson is practical, no filler.'
  },
  {
    name: 'Brian Otieno',
    role: 'Content Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop',
    quote:
      'I have tried free YouTube tutorials before but this course actually has structure. The audio and color sections alone were worth it.'
  },
  {
    name: 'Faiza Mohamed',
    role: 'Social Media Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop',
    quote:
      'Affordable, clear, and taught by people who clearly edit for a living. The certificate also helped me land my current role.'
  }
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    Promise.all([api.get('/courses/featured'), api.get('/categories')])
      .then(([coursesRes, categoriesRes]) => {
        setFeatured(coursesRes.data.courses);
        setCategories(categoriesRes.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-eyebrow"><Play size={13} /> Now enrolling: Premiere Pro Masterclass</span>
            <h1 className="hero-title">
              Skills that move <span>your career</span> forward
            </h1>
            <p className="hero-subtitle">
              {settings.siteName || 'Elevana Hub'} is an affordable online learning platform built for young
              people in Africa who want practical, income-generating skills, without spending a fortune.
            </p>
            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary btn-lg">
                Browse courses <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">Learn more</Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">1,200+</div>
                <div className="hero-stat-label">Students learning</div>
              </div>
              <div>
                <div className="hero-stat-num">4.8/5</div>
                <div className="hero-stat-label">Average rating</div>
              </div>
              <div>
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Online and self-paced</div>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80&auto=format&fit=crop"
              alt="Video editing workspace with color grading timeline"
            />
            <div className="hero-media-badge">
              <span className="hero-media-badge-icon"><Users size={18} /></span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>340 students enrolled</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>in Premiere Pro Masterclass</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Featured course</h2>
              <p>Start with the course our students are taking right now</p>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">View all courses</Link>
          </div>
          {loading ? (
            <div className="courses-grid">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} />
              <p>New courses are on the way. Check back soon.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {featured.map((course) => <CourseCard key={course._id} course={course} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section section-sm" style={{ background: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>Browse by category</h2>
              <p>More categories are added as new courses launch</p>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.name] || BookOpen;
              return (
                <Link to={`/courses?category=${cat._id}`} key={cat._id} className="card category-card">
                  <span className="category-icon"><Icon size={20} /></span>
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.description || 'Explore courses'}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>What students are saying</h2>
              <p>Real feedback from people learning on {settings.siteName || 'Elevana Hub'}</p>
            </div>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="card testimonial-card">
                <Award size={20} color="var(--color-primary)" />
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-person">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div>
              <h2>Ready to build a new skill?</h2>
              <p>Enroll in the Premiere Pro Masterclass and start learning today.</p>
            </div>
            <Link to="/courses" className="btn btn-primary btn-lg">Get started</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
