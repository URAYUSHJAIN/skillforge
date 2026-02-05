import { useState, useEffect } from 'react';
import { Twitter, Linkedin, Globe } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Fallback faculty data - in production these would come from API
const fallbackFaculty = [
  { name: 'Sophia Miller', role: 'React & Frontend', bio: 'Senior developer with 10+ years of experience in building scalable web applications.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  { name: 'John Smith', role: 'Full Stack Development', bio: 'Former Google engineer, now dedicated to teaching the next generation of developers.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
  { name: 'Emma Davis', role: 'UI/UX Design', bio: 'Award-winning designer with a passion for creating beautiful and user-friendly interfaces.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
  { name: 'Michael Chen', role: 'Backend & DevOps', bio: 'Cloud architecture expert helping companies scale their infrastructure efficiently.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
  { name: 'Sarah Wilson', role: 'Data Science & ML', bio: 'PhD in Machine Learning, making AI accessible and understandable for everyone.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300' },
  { name: 'David Brown', role: 'Mobile Development', bio: 'Creator of popular mobile apps with millions of downloads worldwide.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300' },
];

const FacultyPage = () => {
  const [faculty, setFaculty] = useState(fallbackFaculty);

  useEffect(() => {
    // Try to fetch faculty from API if available
    const fetchFaculty = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/faculty`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setFaculty(data);
        }
      } catch {
        // Use fallback data
      }
    };
    fetchFaculty();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full mb-4">
            Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our <span className="gradient-text">Faculty</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Learn from industry experts who are passionate about teaching and sharing their knowledge.
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faculty.map((member, i) => (
              <div 
                key={i} 
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x280?text=Faculty'; }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-12 relative z-10">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                  
                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a 
                      href="#" 
                      className="w-9 h-9 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a 
                      href="#" 
                      className="w-9 h-9 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a 
                      href="#" 
                      className="w-9 h-9 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-slate-800/30">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Want to Teach on SkillForge?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Share your expertise with millions of learners around the world. Join our community of instructors today.
          </p>
          <a href="/contact" className="btn-primary inline-flex items-center gap-2">
            Become an Instructor
          </a>
        </div>
      </section>
    </div>
  );
};

export default FacultyPage;
