import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import HomeCourses from './components/HomeCourses';
import Courses from './components/Courses';
import AboutUsPage from './components/AboutUsPage';
import FacultyPage from './components/FacultyPage';
import ContactPage from './components/ContactPage';
import Testimonial from './components/Testimonial';
import Footer from './components/Footer';
import CourseDetailPage from './components/CourseDetailPage';
import MyCourses from './components/MyCourses';
import BookingSuccess from './components/BookingSuccess';
import Login from './components/Login';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';

// Home page component
const HomePage = () => (
  <>
    <Banner />
    <HomeCourses />
    <Testimonial />
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking/success" element={<BookingSuccess />} />
            <Route path="/booking/cancel" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
