import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { IMAGES } from '@/lib/constants';
import type { Review } from '@/lib/types';
import { Star, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ client_name: '', company: '', rating: 5, review_text: '', location: '' });
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await reviewsAPI.getAll();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.review_text) {
      toast({ title: 'Error', description: 'Please fill in required fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await reviewsAPI.create({
        client_name: form.client_name,
        company: form.company || '',
        rating: form.rating,
        review_text: form.review_text,
        location: form.location || '',
      });
      toast({ title: 'Thank you!', description: 'Your review has been submitted and is pending approval.' });
      setForm({ client_name: '', company: '', rating: 5, review_text: '', location: '' });
      setShowForm(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Client Reviews</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">Hear what our clients have to say about their experience working with Nickztech Construction.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-300">
            <Link to="/" className="hover:text-[#F5A623]">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Reviews</span>
          </div>
        </div>
      </section>

      {/* Stats & CTA */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1F2F8F]">{avgRating}</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <p className="text-gray-600">Our clients consistently rate us highly for quality, professionalism, and reliability.</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-semibold rounded-lg hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Write a Review
          </button>
        </div>
      </section>

      {/* Review Form */}
      {showForm && (
        <section className="py-8 bg-[#F4F4F4] border-b">
          <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2F8F] mb-4">Share Your Experience</h3>
              <p className="text-sm text-gray-500 mb-6">Your review will be published after admin approval.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none" placeholder="e.g., Douala, Cameroon" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setForm(p => ({ ...p, rating: star }))}>
                      <Star className={`w-8 h-8 transition-colors ${star <= form.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea value={form.review_text} onChange={e => setForm(p => ({ ...p, review_text: e.target.value }))} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none resize-none" required />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="px-6 py-3 bg-[#1F2F8F] text-white font-semibold rounded-lg hover:bg-[#2E3FBF] transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Reviews Grid */}
      <section className="py-16 bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <ScrollReveal key={review.id} delay={i * 80}>
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-[#F5A623] fill-[#F5A623]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4 italic">"{review.review_text}"</p>
                    <div className="border-t pt-4">
                      <p className="font-bold text-[#1F2F8F]">{review.client_name}</p>
                      {review.company && <p className="text-sm text-gray-500">{review.company}</p>}
                      {review.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {review.location}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReviewsPage;
