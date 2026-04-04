import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { servicesAPI, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import type { Service } from '@/lib/types';
import { ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '', timeline: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!slug) return;
        const data = await servicesAPI.getBySlug(slug);
        setService(data);
      } catch (error) {
        console.error('Failed to fetch service:', error);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('quote_requests').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service_id: service?.id,
      project_details: formData.details,
      timeline: formData.timeline,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to submit. Please try again.', variant: 'destructive' });
    } else {
      toast({ title: 'Success!', description: 'Your quote request has been submitted. We will contact you soon.' });
      setFormData({ name: '', email: '', phone: '', details: '', timeline: '' });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <div className="w-12 h-12 border-4 border-[#1F2F8F] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Service not found</h2>
          <Link to="/services" className="text-[#F5A623] mt-4 inline-block">Back to Services</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={getImageUrl(service.image_url)} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{service.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[#F5A623]">Services</Link>
            <span>/</span>
            <span className="text-[#F5A623]">{service.title}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Link to="/services" className="inline-flex items-center gap-2 text-[#1F2F8F] hover:text-[#F5A623] mb-6 font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Services
              </Link>
              <img src={getImageUrl(service.image_url)} alt={service.title} className="w-full h-72 md:h-96 object-cover rounded-xl mb-8" />
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-[#1F2F8F] mb-4">About This Service</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{service.description}</p>
              </ScrollReveal>

              {/* Benefits */}
              {service.benefits?.length > 0 && (
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-[#1F2F8F] mb-4">Key Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {service.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#F4F4F4] rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{b}</span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* Process */}
              {service.process_steps?.length > 0 && (
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-[#1F2F8F] mb-4">Our Process</h3>
                  <div className="space-y-4">
                    {service.process_steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1F2F8F] to-[#2E3FBF] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 bg-[#F4F4F4] rounded-lg p-4">
                          <p className="text-gray-700">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Quote Form Sidebar */}
            <div>
              <div className="bg-[#F4F4F4] rounded-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold text-[#1F2F8F] mb-2">Request a Quote</h3>
                <p className="text-sm text-gray-600 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Details *</label>
                    <textarea
                      value={formData.details}
                      onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData(p => ({ ...p, timeline: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select timeline</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="12+ months">12+ months</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetailPage;
