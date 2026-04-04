import React, { useEffect, useState } from 'react';
import { projectsAPI } from '@/lib/api';
import type { Project } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Save, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/api';

const emptyProject = { title: '', slug: '', category: 'Residential', short_description: '', description: '', location: '', highlights: '', images: '', is_featured: false, completed_date: '', imageFiles: [] as File[] };

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getAllAdmin();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast({ title: 'Error', description: 'Title and category are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('slug', form.slug || generateSlug(form.title));
    formData.append('category', form.category);
    formData.append('short_description', form.short_description);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('highlights', JSON.stringify(form.highlights ? form.highlights.split('\n').filter(Boolean) : []));
    formData.append('images', JSON.stringify(form.images ? form.images.split('\n').filter(Boolean) : []));
    formData.append('is_featured', form.is_featured.toString());
    formData.append('completed_date', form.completed_date || '');
    
    form.imageFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });

    try {
      if (editing) {
        await projectsAPI.update(editing, formData);
        toast({ title: 'Success', description: 'Project updated successfully.' });
      } else {
        await projectsAPI.create(formData);
        toast({ title: 'Success', description: 'Project created successfully.' });
      }
      
      setShowForm(false);
      setEditing(null);
      setForm(emptyProject);
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save project.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      short_description: project.short_description || '',
      description: project.description || '',
      location: project.location || '',
      highlights: project.highlights?.join('\n') || '',
      images: project.images?.join('\n') || '',
      is_featured: project.is_featured,
      completed_date: project.completed_date || '',
      imageFiles: [],
    });
    setEditing(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      toast({ title: 'Deleted', description: 'Project deleted successfully.' });
      fetchProjects();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete project.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your portfolio of construction projects.</p>
        </div>
        <button onClick={() => { setForm(emptyProject); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 mb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editing ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm">
                    {['Residential', 'Commercial', 'Infrastructure', 'Industrial', 'Institutional'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
                  <input type="date" value={form.completed_date} onChange={e => setForm(p => ({ ...p, completed_date: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input type="text" value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload (multiple files)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={e => setForm(p => ({ ...p, imageFiles: Array.from(e.target.files || []) }))} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" 
                />
                {form.imageFiles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {form.imageFiles.length} file(s)</p>
                )}
                {form.images && !form.imageFiles.length && (
                  <p className="text-xs text-gray-500 mt-1">Current images: {form.images.split('\n').length} image(s)</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (one per line)</label>
                <textarea value={form.highlights} onChange={e => setForm(p => ({ ...p, highlights: e.target.value }))} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm text-gray-700">Featured project</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium disabled:opacity-50">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Project'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border text-gray-600 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Featured</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No projects found.</td></tr>
              ) : (
                projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {project.images?.[0] && <img src={getImageUrl(project.images[0])} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <span className="font-medium text-sm text-gray-900">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{project.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {project.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${project.is_featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {project.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(project)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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

export default AdminProjects;
