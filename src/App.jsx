import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import NotFound from './pages/NotFound.jsx';

import Profile from './pages/student/Profile.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import LessonPlayer from './pages/student/LessonPlayer.jsx';
import Checkout from './pages/student/Checkout.jsx';
import Certificates from './pages/student/Certificates.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminCourses from './pages/admin/Courses.jsx';
import AdminCourseEditor from './pages/admin/CourseEditor.jsx';
import AdminCurriculum from './pages/admin/Curriculum.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminStudentDetail from './pages/admin/StudentDetail.jsx';
import AdminPayments from './pages/admin/Payments.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import PrivacyPolicy from './pages/PravcyPolicy.jsx';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/checkout/:slug" element={<Checkout />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/learn/:courseId" element={<LessonPlayer />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/courses/new" element={<AdminCourseEditor />} />
          <Route path="/admin/courses/:id/edit" element={<AdminCourseEditor />} />
          <Route path="/admin/courses/:id/curriculum" element={<AdminCurriculum />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
