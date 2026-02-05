import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, BookOpen, Star, Loader2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/course/public`);
        const data = await res.json();
        if (data.success && data.courses) {
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        } else {
          setError('Failed to load courses');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to connect to server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.name?.toLowerCase().includes(term) || c.teacher?.toLowerCase().includes(term)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((c) => (c.category || 'General') === categoryFilter);
    }
    if (priceFilter === 'free') {
      result = result.filter((c) => (c.pricing_type || c.pricingType) === 'free' || !(c.price_sale || c.price?.sale));
    } else if (priceFilter === 'paid') {
      result = result.filter((c) => (c.pricing_type || c.pricingType) === 'paid' && (c.price_sale || c.price?.sale) > 0);
    }
    setFilteredCourses(result);
  }, [searchTerm, categoryFilter, priceFilter, courses]);

  const categories = ['all', ...new Set(courses.map((c) => c.category || 'General').filter(Boolean))];
  
  const getCourseId = (course) => course.id || course._id;
  
  const getImageUrl = (course) => {
    const img = course.image;
    if (!img) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  const getPrice = (course) => {
    const pricingType = course.pricing_type || course.pricingType;
    const salePrice = course.price_sale || course.price?.sale;
    if (pricingType === 'free' || !salePrice || salePrice === 0) return 'Free';
    return `₹${salePrice}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore Courses</h1>
          <p className="text-slate-400">Discover skills that will transform your career</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses or instructors..."
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="input-field min-w-[150px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <select
              className="input-field min-w-[120px]"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-400 mb-6">{filteredCourses.length} courses found</p>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 card p-8">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={getCourseId(course)}
                to={`/course/${getCourseId(course)}`}
                className="card overflow-hidden group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getImageUrl(course)}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      (course.pricing_type || course.pricingType) === 'free' 
                        ? 'bg-green-500/90 text-white' 
                        : 'bg-primary-500/90 text-white'
                    }`}>
                      {getPrice(course)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {(course.category || course.level) && (
                    <span className="text-xs font-medium text-primary-400 mb-2 block">
                      {course.category || course.level}
                    </span>
                  )}
                  <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">{course.teacher}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {Number(course.avg_rating || course.avgRating || 4.5).toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.total_duration_hours || course.totalDuration?.hours || 0}h
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.total_lectures || course.totalLectures || 0}
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

export default Courses;
