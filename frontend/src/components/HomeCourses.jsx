import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const HomeCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/course/public?limit=8`);
        const data = await res.json();
        if (data.success && data.courses) {
          setCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getPrice = (course) => {
    // Handle both snake_case (PostgreSQL) and camelCase (old format)
    const pricingType = course.pricing_type || course.pricingType;
    const salePrice = course.price_sale || course.price?.sale;
    if (pricingType === 'free' || !salePrice || salePrice === 0) return 'Free';
    return `₹${salePrice}`;
  };

  const getDuration = (course) => {
    // Handle both snake_case (PostgreSQL) and camelCase (old format)
    const h = course.total_duration_hours || course.totalDuration?.hours || 0;
    const m = course.total_duration_minutes || course.totalDuration?.minutes || 0;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getCourseId = (course) => course.id || course._id;
  const getImageUrl = (course) => {
    const img = course.image;
    if (!img) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-900/50">
        <div className="section-container flex justify-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return null; // Don't render section if no courses
  }

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="gradient-text">Courses</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore our most popular courses designed by industry experts to help you master new skills
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 8).map((course) => (
            <Link
              key={getCourseId(course)}
              to={`/course/${getCourseId(course)}`}
              className="card overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getImageUrl(course)}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-400 mb-3">{course.teacher}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {Number(course.avg_rating || course.avgRating || 4.5).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getDuration(course)}
                    </span>
                  </div>
                  <span className={`font-bold ${(course.pricing_type || course.pricingType) === 'free' ? 'text-green-400' : 'text-primary-400'}`}>
                    {getPrice(course)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeCourses;
