import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { IMAGES } from '@/lib/constants';
import type { Project } from '@/lib/types';
import { MapPin, ArrowRight } from 'lucide-react';

const categories = ['All', 'Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Institutional'];

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await projectsAPI.getAll('All');
        setProjects(data);
        setFiltered(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleFilter = async (cat: string) => {
    setActiveFilter(cat);
    if (cat === 'All') {
      setFiltered(projects);
    } else {
      try {
        const data = await projectsAPI.getAll(cat);
        setFiltered(data);
      } catch (error) {
        console.error('Failed to fetch filtered projects:', error);
        setFiltered([]);
      }
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Portfolio</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Explore our collection of completed projects showcasing our expertise and commitment to excellence.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Portfolio</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === cat
                    ? 'bg-[#1F2F8F] text-white shadow-lg'
                    : 'bg-[#F4F4F4] text-gray-600 hover:bg-[#1F2F8F]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 80}>
                  <Link
                    to={`/portfolio/${project.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img src={getImageUrl(project.images?.[0])} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#F5A623] text-white text-xs font-semibold rounded-full">{project.category}</span>
                      </div>
                      {project.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-[#1F2F8F] text-white text-xs font-semibold rounded-full">Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#1F2F8F] mb-2 group-hover:text-[#F5A623] transition-colors">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.short_description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        <span className="text-[#F5A623] font-semibold text-sm flex items-center gap-1">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PortfolioPage;
