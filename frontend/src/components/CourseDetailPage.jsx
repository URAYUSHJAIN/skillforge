import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, BookOpen, Star, Play, Lock, CheckCircle, 
  ChevronDown, ChevronUp, Loader2, AlertCircle, User, Users 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, token } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLectures, setExpandedLectures] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/course/${id}`);
        const data = await res.json();
        if (data.success && data.course) {
          setCourse(data.course);
          if (data.course.lectures?.length > 0) {
            setExpandedLectures({ 0: true });
          }
          // Get enrolled count
          setEnrolledCount(data.course.enrolled_count || data.course.enrolledCount || 0);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isLoggedIn || !user?.id) return;
      
      try {
        const res = await fetch(`${API_BASE}/api/booking/check?courseId=${id}&userId=${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (data.enrolled || data.bookingExists || data.alreadyBooked) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error('Enrollment check failed:', err);
      }
    };
    checkEnrollment();
  }, [id, isLoggedIn, user?.id, token]);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: `/course/${id}` } } });
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      const payload = {
        courseId: id,
        courseName: course.name,
        teacherName: course.teacher || '',
        price: getSalePrice(),
        studentName: user.name || '',
        email: user.email || '',
        userId: user.id
      };

      const res = await fetch(`${API_BASE}/api/booking/enroll-free`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setIsEnrolled(true);
        setEnrolledCount(prev => prev + 1);
      } else if (data.checkoutUrl) {
        // Redirect to Stripe checkout for paid courses
        window.location.href = data.checkoutUrl;
      } else {
        setEnrollError(data.message || 'Enrollment failed');
      }
    } catch (err) {
      setEnrollError('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleLecture = (index) => {
    setExpandedLectures(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const normalizeVideoUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/);
      if (fileId) return `https://drive.google.com/file/d/${fileId[0]}/preview`;
    }
    return url;
  };

  // Helper functions for PostgreSQL snake_case fields
  const getImageUrl = () => {
    const img = course?.image;
    if (!img) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  const getPricingType = () => course?.pricing_type || course?.pricingType || 'free';
  const getSalePrice = () => course?.price_sale || course?.price?.sale || 0;
  const getOriginalPrice = () => course?.price_original || course?.price?.original || 0;
  const getAvgRating = () => course?.avg_rating || course?.avgRating || 4.5;
  const getTotalRatings = () => course?.total_ratings || course?.totalRatings || 0;
  const getDurationHours = () => course?.total_duration_hours || course?.totalDuration?.hours || 0;
  const getDurationMinutes = () => course?.total_duration_minutes || course?.totalDuration?.minutes || 0;
  const getTotalLectures = () => course?.total_lectures || course?.totalLectures || 0;
  const getOverview = () => course?.overview || course?.description || '';

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="section-container">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{error || 'Course not found'}</h2>
            <Link to="/courses" className="btn-primary mt-4 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price = getPricingType() === 'free' ? 'Free' : `₹${getSalePrice()}`;
  const lectures = course.lectures || [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="section-container">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {(course.category || course.level) && (
                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium mb-4">
                  {course.category || course.level}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.name}</h1>
              <p className="text-slate-300 mb-6 line-clamp-3">{getOverview()}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {course.teacher}
                </span>
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {Number(getAvgRating()).toFixed(1)} ({getTotalRatings()} ratings)
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {getDurationHours()}h {getDurationMinutes()}m
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {getTotalLectures()} lectures
                </span>
              </div>
            </div>

            {/* Price Card */}
            <div className="card p-6">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={getImageUrl()} 
                  alt={course.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
                  }}
                />
              </div>
              <div className="text-center mb-4">
                <span className={`text-3xl font-bold ${getPricingType() === 'free' ? 'text-green-400' : 'text-white'}`}>
                  {price}
                </span>
                {getPricingType() !== 'free' && getOriginalPrice() > getSalePrice() && (
                  <span className="text-slate-500 line-through ml-2">₹{getOriginalPrice()}</span>
                )}
              </div>
              
              {enrollError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {enrollError}
                </div>
              )}

              {isEnrolled ? (
                <button 
                  onClick={() => navigate('/my-courses')}
                  className="w-full py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Enrolled - Go to My Courses
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {getPricingType() === 'free' ? 'Enroll for Free' : 'Enroll Now'}
                    </>
                  )}
                </button>
              )}

              {enrolledCount > 0 && (
                <p className="text-center text-sm text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  {enrolledCount} students enrolled
                </p>
              )}
              <p className="text-center text-sm text-slate-500 mt-2">
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="section-container mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* About */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">About this Course</h2>
              <p className="text-slate-300 whitespace-pre-line">{getOverview()}</p>
            </div>

            {/* Curriculum */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Course Content ({lectures.length} lectures)
              </h2>
              <div className="space-y-3">
                {lectures.length === 0 ? (
                  <p className="text-slate-400">No curriculum available yet</p>
                ) : (
                  lectures.map((lecture, idx) => (
                    <div key={lecture.id || idx} className="border border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleLecture(idx)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-medium">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-white">{lecture.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-400">
                            {lecture.chapters?.length || 0} chapters
                          </span>
                          {expandedLectures[idx] ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>
                      {expandedLectures[idx] && lecture.chapters && (
                        <div className="bg-slate-900/50 divide-y divide-slate-800">
                          {lecture.chapters.map((chapter, chIdx) => (
                            <div
                              key={chapter.id || chIdx}
                              className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors cursor-pointer"
                              onClick={() => {
                                const url = normalizeVideoUrl(chapter.video_url || chapter.videoUrl);
                                if (url && (chapter.is_preview || chapter.isPreview)) {
                                  setActiveVideo(url);
                                }
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {(chapter.is_preview || chapter.isPreview) ? (
                                  <Play className="w-4 h-4 text-primary-400" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-500" />
                                )}
                                <span className="text-slate-300">{chapter.name || chapter.title}</span>
                                {(chapter.is_preview || chapter.isPreview) && (
                                  <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-slate-500">
                                {chapter.duration_hours || chapter.durationHours || 0}:{String(chapter.duration_minutes || chapter.durationMinutes || 0).padStart(2, '0')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-white mb-4">This course includes</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {getDurationHours()} hours of video content
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {getTotalLectures()} comprehensive lectures
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Lifetime access
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Certificate of completion
                </li>
              </ul>
            </div>

            {course.language && (
              <div className="card p-6">
                <h3 className="font-bold text-white mb-2">Language</h3>
                <p className="text-slate-300">{course.language}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              src={activeVideo}
              className="w-full h-full rounded-lg"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
