import { GraduationCap, BookOpen, Award, Lightbulb, Globe, RefreshCw, Target, Heart } from 'lucide-react';

const features = [
  { icon: GraduationCap, title: 'Expert Instructors', text: 'Learn from industry professionals with years of experience' },
  { icon: BookOpen, title: 'Quality Content', text: 'Carefully curated courses designed for effective learning' },
  { icon: Award, title: 'Certificates', text: 'Earn recognized certificates upon course completion' },
  { icon: Lightbulb, title: 'Practical Skills', text: 'Hands-on projects and real-world applications' },
  { icon: Globe, title: 'Global Community', text: 'Join thousands of learners from around the world' },
  { icon: RefreshCw, title: 'Lifetime Access', text: 'Access your courses anytime, anywhere, forever' },
];

const stats = [
  { value: '50K+', label: 'Students' },
  { value: '200+', label: 'Courses' },
  { value: '100+', label: 'Instructors' },
  { value: '95%', label: 'Satisfaction' },
];

const values = [
  { icon: Target, title: 'Mission', text: 'To democratize quality education and make learning accessible to everyone, everywhere.' },
  { icon: Heart, title: 'Values', text: 'Excellence, integrity, innovation, and a deep commitment to student success.' },
];

const AboutUsPage = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="section-container relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-full mb-4">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="gradient-text">SkillForge</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Empowering learners worldwide with quality education and cutting-edge courses from industry experts.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-slate-400">Numbers that reflect our commitment to education</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Our Story</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 md:p-12">
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                Founded in 2020, SkillForge started with a simple mission: to make quality education accessible to everyone. 
                What began as a small team of passionate educators has grown into a thriving community of learners and 
                instructors from around the globe.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                We believe that learning should be engaging, practical, and accessible. Every course we offer is designed 
                with our students in mind, combining expert knowledge with hands-on practice to ensure real-world skills 
                that make a difference in careers and lives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
