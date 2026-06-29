import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="notfound-wrapper">
    <div className="notfound-code">404</div>
    <h1 style={{ fontSize: 22, marginBottom: 8 }}>Page not found</h1>
    <p className="text-muted" style={{ marginBottom: 20 }}>The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">Back to home</Link>
  </div>
);

export default NotFound;
