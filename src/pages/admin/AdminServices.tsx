import React, { useEffect, useState } from 'react';
import { servicesAPI } from '@/lib/api';
import type { Service } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/api';

const emptyService = { title: '', slug: '', short_description: '', description: '', image_url: '', benefits: '', process_steps: '', icon: 'building', sort_order: 0, imageFile: null as File | null };

const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAllAdmin();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.short_description) {
      toast({ title: 'Error', description: 'Title and short description are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug || generateSlug(form.title));
    formData.append('short_description', form.short_description);
    formData.append('description', form.description);
    formData.append('benefits', JSON.stringify(form.benefits ? form.benefits.split('\n').filter(Boolean) : []));
    formData.append('process_steps', JSON.stringify(form.process_steps ? form.process_steps.split('\n').filter(Boolean) : []));
    formData.append('icon', form.icon);
    formData.append('sort_order', form.sort_order.toString());
    
    if (form.imageFile) {
      formData.append('image_url', form.imageFile);
    }

    try {
      if (editing) {
        await servicesAPI.update(editing, formData);
        toast({ title: 'Success', description: 'Service updated successfully.' });
      } else {
        await servicesAPI.create(formData);
        toast({ title: 'Success', description: 'Service created successfully.' });
      }
      
      setShowForm(false);
      setEditing(null);
      setForm(emptyService);
      fetchServices();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save service.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      title: service.title,
      slug: service.slug,
      short_description: service.short_description || '',
      description: service.description || '',
      image_url: service.image_url || '',
      benefits: service.benefits?.join('\n') || '',
      process_steps: service.process_steps?.join('\n') || '',
      icon: service.icon || 'building',
      sort_order: service.sort_order || 0,
      imageFile: null,
    });
    setEditing(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      toast({ title: 'Deleted', description: 'Service deleted successfully.' });
      fetchServices();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete service.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and manage your construction services.</p>
        </div>
        <button
          onClick={() => { setForm(emptyService); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 mb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <input type="text" value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setForm(p => ({ ...p, imageFile: e.target.files?.[0] || null }))} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" 
                />
                {form.image_url && !form.imageFile && (
                  <p className="text-xs text-gray-500 mt-1">Current: {form.image_url}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                <textarea value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm resize-none" placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Process Steps (one per line)</label>
                <textarea value={form.process_steps} onChange={e => setForm(p => ({ ...p, process_steps: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm resize-none" placeholder="Step 1&#10;Step 2&#10;Step 3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm">
                    <option value="building">Building</option>
                    <option value="road">Road</option>
                    <option value="design">Design</option>
                    <option value="renovation">Renovation</option>
                    <option value="interior">Interior</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="landscape">Landscape</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Service'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border text-gray-600 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No services found.</td></tr>
              ) : (
                services.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {service.image_url && <img src={getImageUrl(service.image_url)} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="font-medium text-sm text-gray-900">{service.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{service.short_description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{service.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(service)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(service.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
