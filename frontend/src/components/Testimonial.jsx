import { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Fallback testimonials for demo - in production these would come from API
const fallbackTestimonials = [
  { 
    name: 'Alex Johnson', 
    role: 'Frontend Developer', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 
    rating: 5, 
    quote: 'The React Masterclass completely transformed my career. Within 3 months of completing the course, I landed my dream job at a top tech company!' 
  },
  { 
    name: 'Maria Garcia', 
    role: 'UX Designer', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 
    rating: 5, 
    quote: 'Best investment in my education! The instructors are incredibly knowledgeable and the practical projects helped me build a strong portfolio.' 
  },
  { 
    name: 'James Wilson', 
    role: 'Full Stack Developer', 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 
    rating: 5, 
    quote: 'I went from zero coding knowledge to building complete web applications. The step-by-step approach made complex concepts easy to understand.' 
  },
];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Try to fetch testimonials from API if available
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setTestimonials(data);
        }
      } catch {
        // Use fallback testimonials
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join thousands of satisfied learners who have transformed their careers with SkillForge
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Quote className="w-6 h-6 text-white" />
            </div>

            {/* Quote Text */}
            <blockquote className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-8 mt-4">
              "{testimonials[currentIndex].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                />
                <div>
                  <div className="text-white font-semibold">{testimonials[currentIndex].name}</div>
                  <div className="text-slate-400 text-sm">{testimonials[currentIndex].role}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute -bottom-5 right-8 flex gap-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex 
                    ? 'w-8 bg-primary-500' 
                    : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: '50K+', label: 'Students Enrolled' },
            { value: '4.9', label: 'Average Rating' },
            { value: '200+', label: 'Expert Instructors' },
            { value: '95%', label: 'Completion Rate' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
