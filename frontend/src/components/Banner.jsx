import { Link } from 'react-router-dom';
import { Play, BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const stats = [
  { icon: BookOpen, value: '500+', label: 'Courses' },
  { icon: Users, value: '50K+', label: 'Students' },
  { icon: Award, value: '100+', label: 'Instructors' },
];

const Banner = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="section-container relative z-10 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-primary-300 font-medium">New courses added weekly</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Master New Skills</span>
              <br />
              <span className="gradient-text">Transform Your Career</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              Join thousands of learners mastering in-demand skills. From web development to data science, 
              learn from industry experts and accelerate your career growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="btn-primary inline-flex items-center justify-center gap-2">
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="btn-secondary inline-flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-700">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up hidden lg:block">
            <div className="relative">
              {/* Main image */}
              <div className="glass rounded-3xl p-2 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" 
                  alt="Students learning together"
                  className="rounded-2xl w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Certified</p>
                    <p className="text-xs text-slate-400">Industry recognized</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-slate-800" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-300">+2.5K enrolled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
