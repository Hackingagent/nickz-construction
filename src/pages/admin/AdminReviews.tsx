import React, { useEffect, useState } from 'react';
import { reviewsAPI } from '@/lib/api';
import type { Review } from '@/lib/types';
import { CheckCircle, XCircle, Trash2, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      let data;
      if (filter === 'pending') {
        data = await reviewsAPI.getAllPending();
      } else if (filter === 'approved') {
        data = await reviewsAPI.getAllApproved();
      } else {
        data = await reviewsAPI.getAllAdmin();
      }
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      await reviewsAPI.approve(id);
      toast({ title: 'Approved', description: 'Review has been approved and is now visible.' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve review.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewsAPI.reject(id);
      toast({ title: 'Rejected', description: 'Review has been hidden from public view.' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject review.', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reviewsAPI.delete(id);
      toast({ title: 'Deleted', description: 'Review has been deleted permanently.' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete review.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-500 text-sm mt-1">Moderate and manage client reviews.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-[#1F2F8F] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">No reviews found.</div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#1F2F8F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.client_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.client_name}</p>
                      <div className="flex items-center gap-2">
                        {review.company && <span className="text-xs text-gray-500">{review.company}</span>}
                        {review.location && <span className="text-xs text-gray-400">| {review.location}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.review_text}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!review.is_approved && (
                    <button onClick={() => handleApprove(review.id)} className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors" title="Approve">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  {review.is_approved && (
                    <button onClick={() => handleReject(review.id)} className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors" title="Hide">
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
