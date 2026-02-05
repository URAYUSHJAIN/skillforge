import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Play, Trophy, Loader2, GraduationCap, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { user, isLoggedIn, token, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!isLoggedIn || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user's bookings
        const bookingsRes = await fetch(`${API_BASE}/api/booking/my?userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const bookingsData = await bookingsRes.json();

        if (bookingsData.success && bookingsData.bookings) {
          // Filter only paid/confirmed bookings and fetch course details
          const confirmedBookings = bookingsData.bookings.filter(
            b => (b.payment_status === 'Paid' || b.payment_status === 'paid') && 
                 ['Confirmed', 'confirmed', 'Completed', 'completed'].includes(b.order_status)
          );

          // Fetch full course data for each enrolled course
          const coursesWithDetails = await Promise.all(
            confirmedBookings.map(async (booking) => {
              try {
                const courseId = booking.course_id || booking.course;
                const courseRes = await fetch(`${API_BASE}/api/course/${courseId}`);
                const courseData = await courseRes.json();
                return courseData.success ? { 
                  ...courseData.course, 
                  bookingDate: booking.created_at || booking.createdAt,
                  bookingId: booking.id
                } : null;
              } catch {
                return null;
              }
            })
          );

          setEnrolledCourses(coursesWithDetails.filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchEnrolledCourses();
    }
  }, [isLoggedIn, user?.id, token, authLoading]);

  // Redirect to login if not authenticated
  if (!authLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-950">
        <div className="section-container">
          <div className="text-center py-20">
            <GraduationCap className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Sign in to view your courses</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Access your enrolled courses and continue your learning journey
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="btn-primary flex items-center gap-2">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/courses" className="px-6 py-3 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 rounded-xl transition-all">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  // Helper to get course image URL
  const getCourseImage = (course) => {
    const img = course.image || course.thumbnail;
    if (!img) return null;
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Courses</h1>
              <p className="text-slate-400">Continue your learning journey</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <Trophy className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">No courses yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Start your learning journey by enrolling in a course
            </p>
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
              Explore Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Link
                key={course.id || course._id}
                to={`/course/${course.id || course._id}`}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden group hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  {getCourseImage(course) ? (
                    <img
                      src={getCourseImage(course)}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                    Enrolled
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-sm">
                    <span className="text-white/80 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.total_duration_hours || course.totalDuration?.hours || 0}h
                    </span>
                    <span className="text-white/80 flex items-center gap-1">
                      <Play className="w-4 h-4" />
                      {course.total_lectures || course.totalLectures || 0} lectures
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">{course.teacher}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {Number(course.avg_rating || course.avgRating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-primary-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
