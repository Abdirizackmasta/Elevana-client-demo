import { GraduationCap, TrendingUp, Users, Target } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

const About = () => {
  const settings = useSettings();

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>About {settings.siteName || 'Elevana Hub'}</h1>
          <p>{settings.tagline || 'Skills That Move You Forward'}</p>
        </div>
      </div>

      <div className="container about-hero">
        <div>
          <h2 className="course-section-title" style={{ fontSize: 24, marginBottom: 16 }}>Practical education, made accessible</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--color-body)', marginBottom: 16 }}>
            {settings.siteName || 'Elevana Hub'} is a modern learning platform built to help people acquire
            practical, income-generating skills. We focus on courses that translate directly into work you can
            get paid for, starting with video editing and expanding into design, marketing, and business.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--color-body)' }}>
            Our courses are taught by people who do this work professionally, structured around real projects
            rather than theory, and priced so that cost is never the reason someone misses an opportunity to learn.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop"
          alt="Student studying with a laptop"
        />
      </div>

      <div className="container section-sm">
        <div className="section-heading">
          <div>
            <h2>What we stand for</h2>
          </div>
        </div>
        <div className="value-grid">
          <div className="card value-card">
            <span className="category-icon"><GraduationCap size={20} /></span>
            <div className="category-name">Learn</div>
            <p className="text-muted" style={{ fontSize: 13.5 }}>Access quality, structured learning material built around real work.</p>
          </div>
          <div className="card value-card">
            <span className="category-icon"><TrendingUp size={20} /></span>
            <div className="category-name">Elevate</div>
            <p className="text-muted" style={{ fontSize: 13.5 }}>Improve your skills and mindset with practical, hands-on lessons.</p>
          </div>
          <div className="card value-card">
            <span className="category-icon"><Target size={20} /></span>
            <div className="category-name">Apply</div>
            <p className="text-muted" style={{ fontSize: 13.5 }}>Turn what you learn into income, whether freelance or full-time.</p>
          </div>
        </div>
      </div>

      <div className="container section-sm" style={{ paddingBottom: 60 }}>
        <div className="section-heading"><div><h2>Founder</h2></div></div>
        <div className="card founder-card">
          <img
            className="founder-avatar"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop"
            alt="Mohamed Islam"
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink)' }}>Mohamed Islam</div>
            <div className="text-muted" style={{ fontSize: 13.5, marginBottom: 6 }}>Founder and CEO, {settings.siteName || 'Elevana Hub'}</div>
            <p style={{ fontSize: 13.5, color: 'var(--color-body)' }}>
              Building accessible, practical education for young people across Africa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
