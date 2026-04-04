import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { IMAGES } from '@/lib/constants';
import type { Service } from '@/lib/types';
import { ArrowRight, Building2 } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await servicesAPI.getAll();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Comprehensive construction services tailored to meet your every need, from concept to completion.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Services</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={i * 100}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 block h-full"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img src={getImageUrl(service.image_url)} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1F2F8F] mb-3 group-hover:text-[#F5A623] transition-colors">{service.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.short_description}</p>
                      <div className="flex items-center gap-2 text-[#F5A623] font-semibold text-sm">
                        Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#1F2F8F] to-[#2E3FBF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
          <p className="text-blue-200 mb-8">Contact us to discuss your specific construction requirements and get a personalized quote.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-bold rounded-lg hover:shadow-xl transition-all">
            Request a Quote <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
