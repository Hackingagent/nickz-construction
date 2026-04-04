import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { BRAND, IMAGES } from '@/lib/constants';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await contactsAPI.create({
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        subject: form.subject || '',
        message: form.message,
      });
      toast({ title: 'Success', description: 'Your message has been sent successfully!' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message. Please try again.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Get in touch with our team to discuss your construction project or request a free quote.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-10">
            {[
              { icon: MapPin, title: 'Our Location', lines: [BRAND.address], color: 'bg-blue-50 text-[#1F2F8F]' },
              { icon: Phone, title: 'Phone Numbers', lines: [BRAND.phone1, BRAND.phone2], color: 'bg-orange-50 text-[#F5A623]' },
              { icon: Mail, title: 'Email Address', lines: [BRAND.email], color: 'bg-blue-50 text-[#1F2F8F]' },
              { icon: Clock, title: 'Working Hours', lines: ['Mon - Fri: 8AM - 6PM', 'Sat: 9AM - 2PM'], color: 'bg-orange-50 text-[#F5A623]' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow h-full">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-[#1F2F8F] mb-2">{item.title}</h4>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-600 text-sm">{line}</p>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-16 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1F2F8F] mb-2">Send Us a Message</h2>
                <p className="text-gray-600 text-sm mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] focus:border-transparent outline-none transition-all resize-none" required />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-[#1F2F8F] to-[#2E3FBF] text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            {/* Map & WhatsApp */}
            <ScrollReveal delay={200}>
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden shadow-sm h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254936.70243984!2d9.6510974!3d4.0510564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061128be2e1fe6d%3A0x92daa1444781c48b!2sDouala%2C%20Cameroon!5e0!3m2!1sen!2s!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Nickztech Construction Location"
                  />
                </div>
                <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-xl p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">Chat on WhatsApp</h4>
                      <p className="text-white/80 text-sm">Get instant responses to your enquiries</p>
                    </div>
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}?text=Hello%20Nickztech%20Construction!%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white text-[#25D366] font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                    >
                      Chat Now
                    </a>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-[#1F2F8F] mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
