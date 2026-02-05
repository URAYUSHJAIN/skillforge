import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Twitter, Github, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SkillForge</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering learners worldwide with quality education and cutting-edge courses from industry experts.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Courses</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/courses" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Development</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Design</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Data Science</Link></li>
              <li><Link to="/courses" className="text-slate-400 hover:text-primary-400 transition-colors text-sm">Business</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                support@skillforge.com
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                +91 9876543210
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                Mumbai, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© {currentYear} SkillForge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
