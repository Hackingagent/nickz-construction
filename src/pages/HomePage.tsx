import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, IMAGES } from '@/lib/constants';
import type { Service, Project, Review } from '@/lib/types';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { ArrowRight, Building2, Hammer, HardHat, Award, Users, Globe, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { servicesAPI, projectsAPI, reviewsAPI, getImageUrl } from '@/lib/api';

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, pRes, rRes] = await Promise.all([
          servicesAPI.getAll(),
          projectsAPI.getAll(undefined),
          reviewsAPI.getAll(),
        ]);
        setServices(sRes);
        setProjects(pRes);
        setReviews(rRes);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  const nextReview = () => setCurrentReview(prev => (prev + 1) % Math.max(reviews.length, 1));
  const prevReview = () => setCurrentReview(prev => (prev - 1 + reviews.length) % Math.max(reviews.length, 1));

  const stats = [
    { icon: Building2, value: '200+', label: 'Projects Completed' },
    { icon: Users, value: '150+', label: 'Happy Clients' },
    { icon: HardHat, value: '15+', label: 'Years Experience' },
    { icon: Globe, value: '5+', label: 'Countries Served' },
  ];

  const serviceIcons: Record<string, React.ReactNode> = {
    building: <Building2 className="w-8 h-8" />,
    road: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 20h16M4 20V4m16 16V4M8 20V8m8 12V8M12 20V12"/></svg>,
    design: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
    renovation: <Hammer className="w-8 h-8" />,
    interior: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
    plumbing: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 12h12M12 6v12M9 3h6M9 21h6"/></svg>,
    landscape: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3l8 18H4L12 3z"/><circle cx="12" cy="8" r="2"/></svg>,
    consulting: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Construction site" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2F8F]/90 via-[#1F2F8F]/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#F5A623] rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Cameroon's Premier Construction Company</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Building the Future,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5A623] to-[#FF8C00]">
                One Foundation at a Time
              </span>
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl">
              {BRAND.tagline}. From residential homes to commercial complexes and infrastructure projects, we deliver excellence across Cameroon and beyond.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-bold rounded-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                View Our Projects
              </Link>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white -mt-16 relative z-10 max-w-6xl mx-auto rounded-2xl shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 100} className="p-6 md:p-8 text-center">
              <stat.icon className="w-8 h-8 text-[#F5A623] mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-[#1F2F8F]">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer a comprehensive range of construction services to meet your every need, from initial design to final finishing.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 100}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={getImageUrl(service.image_url)} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-[#1F2F8F]/10 rounded-lg flex items-center justify-center text-[#1F2F8F] mb-4 group-hover:bg-[#F5A623] group-hover:text-white transition-colors">
                      {serviceIcons[service.icon] || <Building2 className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2F8F] mb-2 group-hover:text-[#F5A623] transition-colors">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.short_description}</p>
                    <div className="mt-4 flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                      Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1F2F8F] text-white font-semibold rounded-lg hover:bg-[#2E3FBF] transition-colors">
              View All Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Our Work</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our portfolio of completed projects that showcase our commitment to quality and excellence.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 150}>
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="group relative rounded-xl overflow-hidden h-72 md:h-80 block"
                >
                  <img src={getImageUrl(project.images?.[0])} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F2F8F]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-[#F5A623] text-white text-xs font-semibold rounded-full mb-3">{project.category}</span>
                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                    <p className="text-white/70 text-sm">{project.location}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold rounded-lg hover:shadow-lg transition-all">
              View All Projects <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">Building Excellence Since Day One</h2>
              <p className="text-blue-200 mb-8 leading-relaxed">
                At Nickztech Construction, we combine years of industry experience with innovative techniques to deliver projects that exceed expectations. Our commitment to quality, safety, and client satisfaction sets us apart.
              </p>
              <div className="space-y-4">
                {[
                  'Experienced team of certified professionals',
                  'Premium quality materials and modern equipment',
                  'On-time project delivery guarantee',
                  'Transparent communication throughout',
                  'Competitive pricing without compromising quality',
                  'Post-completion support and warranty',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F5A623] flex-shrink-0" />
                    <span className="text-blue-100">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#F5A623] text-white font-semibold rounded-lg hover:bg-[#FF8C00] transition-colors">
                Learn More About Us <ArrowRight className="w-5 h-5" />
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative">
                <img src={IMAGES.team} alt="Our team" className="rounded-xl shadow-2xl w-full" />
                <div className="absolute -bottom-6 -left-6 bg-[#F5A623] text-white p-6 rounded-xl shadow-xl">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section className="py-20 bg-[#F4F4F4]">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal className="text-center mb-14">
              <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">What Our Clients Say</h2>
            </ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg relative">
                <svg className="w-12 h-12 text-[#F5A623]/20 absolute top-6 left-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <div className="flex items-center gap-1 mb-4 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < (reviews[currentReview]?.rating || 5) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed text-center mb-6 italic">
                  "{reviews[currentReview]?.review_text}"
                </p>
                <div className="text-center">
                  <p className="font-bold text-[#1F2F8F]">{reviews[currentReview]?.client_name}</p>
                  {reviews[currentReview]?.company && (
                    <p className="text-sm text-gray-500">{reviews[currentReview]?.company}</p>
                  )}
                  {reviews[currentReview]?.location && (
                    <p className="text-xs text-gray-400 mt-1">{reviews[currentReview]?.location}</p>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={prevReview} className="w-10 h-10 rounded-full border-2 border-[#1F2F8F]/20 flex items-center justify-center hover:bg-[#1F2F8F] hover:text-white hover:border-[#1F2F8F] transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    {reviews.map((_, i) => (
                      <button key={i} onClick={() => setCurrentReview(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentReview ? 'bg-[#F5A623] w-6' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                  <button onClick={nextReview} className="w-10 h-10 rounded-full border-2 border-[#1F2F8F]/20 flex items-center justify-center hover:bg-[#1F2F8F] hover:text-white hover:border-[#1F2F8F] transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/reviews" className="text-[#1F2F8F] font-semibold hover:text-[#F5A623] transition-colors inline-flex items-center gap-2">
                Read All Reviews <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Global Presence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal className="text-center">
            <span className="text-[#F5A623] font-semibold text-sm uppercase tracking-wider">Global Reach</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2F8F] mt-2 mb-4">Based in Cameroon, Building Worldwide</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
              Headquartered in Douala, Cameroon, Nickztech Construction has expanded its operations across multiple countries, delivering world-class construction services wherever our clients need us.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { country: 'Cameroon', flag: '🇨🇲', projects: '150+' },
              { country: 'Nigeria', flag: '🇳🇬', projects: '25+' },
              { country: 'Gabon', flag: '🇬🇦', projects: '15+' },
              { country: 'Equatorial Guinea', flag: '🇬🇶', projects: '10+' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-[#F4F4F4] rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{item.flag}</div>
                  <h4 className="font-bold text-[#1F2F8F]">{item.country}</h4>
                  <p className="text-sm text-gray-500">{item.projects} Projects</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
