import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    api
      .get('/courses', { params })
      .then(({ data }) => setCourses(data.courses))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Explore courses</h1>
          <p>Practical skills taught step by step. New courses are added regularly.</p>
        </div>
      </div>

      <div className="container section-sm">
        <div className="courses-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search courses"
              defaultValue={search}
              onChange={(e) => updateParam('search', e.target.value)}
            />
          </div>
          <select className="filter-select" value={category} onChange={(e) => updateParam('category', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
            <option value="">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {loading ? (
          <div className="courses-grid">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={36} />
            <p>No courses match your search right now.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
