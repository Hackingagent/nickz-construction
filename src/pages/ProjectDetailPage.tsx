import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsAPI, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import type { Project } from '@/lib/types';
import { MapPin, Calendar, ArrowLeft, Share2, CheckCircle2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!slug) return;
        const data = await projectsAPI.getBySlug(slug);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this project: ${project?.title}`;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      copy: url,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Project link copied to clipboard.' });
    } else {
      window.open(urls[platform], '_blank');
    }
    setShowShare(false);
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

  if (!project) {
    return (
      <Layout>
        <div className="py-32 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Project not found</h2>
          <Link to="/portfolio" className="text-[#F5A623] mt-4 inline-block">Back to Portfolio</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-[#1F2F8F] to-[#0D1B4A] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={getImageUrl(project.images?.[0])} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#F5A623] text-white text-sm font-semibold rounded-full mb-4">{project.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
          <div className="flex items-center justify-center gap-4 text-blue-200">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {project.location}</span>
            {project.completed_date && (
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(project.completed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-[#1F2F8F] hover:text-[#F5A623] font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
            <div className="relative">
              <button onClick={() => setShowShare(!showShare)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              {showShare && (
                <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg p-3 z-10 min-w-[160px]">
                  <button onClick={() => handleShare('facebook')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Facebook</button>
                  <button onClick={() => handleShare('twitter')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Twitter</button>
                  <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">WhatsApp</button>
                  <button onClick={() => handleShare('copy')} className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm">Copy Link</button>
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-12">
            <div className="rounded-xl overflow-hidden mb-4 h-[400px] md:h-[500px]">
              <img src={getImageUrl(project.images?.[selectedImage])} alt={project.title} className="w-full h-full object-cover" />
            </div>
            {project.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-[#F5A623] ring-2 ring-[#F5A623]/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-2xl font-bold text-[#1F2F8F] mb-4">Project Description</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{project.description}</p>
              </ScrollReveal>

              {project.highlights?.length > 0 && (
                <ScrollReveal>
                  <h3 className="text-xl font-bold text-[#1F2F8F] mb-4">Project Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 bg-[#F4F4F4] rounded-lg p-4">
                        <CheckCircle2 className="w-5 h-5 text-[#F5A623] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{h}</span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-[#F4F4F4] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#1F2F8F] mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold text-gray-800">{project.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{project.location}</p>
                  </div>
                  {project.completed_date && (
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="font-semibold text-gray-800">{new Date(project.completed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    </div>
                  )}
                </div>
                <Link
                  to="/contact"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F5A623] to-[#FF8C00] text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Start a Similar Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetailPage;
