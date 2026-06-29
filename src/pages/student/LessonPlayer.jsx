import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, FileText, Download, ChevronLeft, ChevronRight, Award
} from 'lucide-react';
import api from '../../api/axios.js';
import { useSettings } from '../../context/SettingsContext.jsx';

const LessonPlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const settings = useSettings();
  const [data, setData] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [marking, setMarking] = useState(false);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    api.get(`/enrollments/learn/${courseId}`).then(({ data }) => {
      setData(data);
      const lastLesson = data.enrollment.lastLesson;
      const allLessons = data.curriculum.flatMap((s) => s.lessons);
      setActiveLessonId(lastLesson || allLessons[0]?._id);
    });
  }, [courseId]);

  const allLessons = useMemo(() => (data ? data.curriculum.flatMap((s) => s.lessons) : []), [data]);
  const activeLesson = allLessons.find((l) => l._id === activeLessonId);
  const activeIndex = allLessons.findIndex((l) => l._id === activeLessonId);
  const completedSet = new Set((data?.enrollment.completedLessons || []).map(String));
  const isCompleted = activeLesson && completedSet.has(String(activeLesson._id));

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      const { data: res } = await api.post(`/enrollments/learn/${courseId}/complete-lesson`, { lessonId: activeLesson._id });
      setData((prev) => ({ ...prev, enrollment: res.enrollment }));
    } finally {
      setMarking(false);
    }
  };

  const goToLesson = (id) => setActiveLessonId(id);

  const goNext = () => {
    if (activeIndex < allLessons.length - 1) setActiveLessonId(allLessons[activeIndex + 1]._id);
  };
  const goPrev = () => {
    if (activeIndex > 0) setActiveLessonId(allLessons[activeIndex - 1]._id);
  };

  const handleGetCertificate = async () => {
    setCertLoading(true);
    try {
      await api.post(`/enrollments/learn/${courseId}/certificate`);
      navigate('/certificates');
    } finally {
      setCertLoading(false);
    }
  };

  if (!data || !activeLesson) return <div className="page-loading"><div className="spinner spinner-dark" /></div>;

  const progress = data.enrollment.progressPercent;

  return (
    <div>
      <div className="learn-header">
        <div className="learn-header-left">
          <Link to="/my-courses" className="btn btn-ghost btn-sm"><ArrowLeft size={15} /></Link>
          <span className="learn-header-title">{data.course.title}</span>
        </div>
        <div className="learn-header-progress">
          <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          <span className="text-muted" style={{ fontSize: 12.5 }}>{progress}%</span>
          {progress === 100 && (
            <button className="btn btn-outline btn-sm" onClick={handleGetCertificate} disabled={certLoading}>
              <Award size={14} /> Get certificate
            </button>
          )}
        </div>
      </div>

      <div className="learn-layout">
        <div className="learn-main">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${activeLesson.youtubeVideoId}?rel=0&modestbranding=1`}
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h1 style={{ fontSize: 20, marginBottom: 8 }}>{activeLesson.title}</h1>
          {activeLesson.description && (
            <p style={{ fontSize: 14, color: 'var(--color-body)', lineHeight: 1.7, marginBottom: 18 }}>{activeLesson.description}</p>
          )}

          {activeLesson.resources?.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 14.5, marginBottom: 10 }}>Resources</h3>
              {activeLesson.resources.map((res, i) => (
                <a key={i} href={res.fileUrl} target="_blank" rel="noreferrer" className="resource-item">
                  <span className="resource-item-left"><FileText size={16} /> {res.title}</span>
                  <Download size={15} color="var(--color-muted)" />
                </a>
              ))}
            </div>
          )}

          <button className="btn btn-primary btn-sm" onClick={handleMarkComplete} disabled={marking || isCompleted}>
            <CheckCircle2 size={15} /> {isCompleted ? 'Lesson completed' : 'Mark as complete'}
          </button>

          <div className="lesson-nav-row">
            <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={activeIndex === 0}>
              <ChevronLeft size={15} /> Previous
            </button>
            <button className="btn btn-outline btn-sm" onClick={goNext} disabled={activeIndex === allLessons.length - 1}>
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="learn-sidebar">
          <div className="learn-sidebar-header">Course content</div>
          {data.curriculum.map((section) => (
            <div key={section._id}>
              <div className="learn-sidebar-section-title">{section.title}</div>
              {section.lessons.map((lesson) => {
                const done = completedSet.has(String(lesson._id));
                return (
                  <div
                    key={lesson._id}
                    className={`learn-lesson-item ${lesson._id === activeLessonId ? 'active' : ''}`}
                    onClick={() => goToLesson(lesson._id)}
                  >
                    <span className="learn-lesson-check">
                      {done ? <CheckCircle2 size={15} color="var(--color-success)" /> : <Circle size={15} color="var(--color-border)" />}
                    </span>
                    <span>{lesson.title}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
