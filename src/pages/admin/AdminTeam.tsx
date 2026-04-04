import React, { useEffect, useState } from 'react';
import { teamAPI, getImageUrl } from '@/lib/api';
import type { TeamMember } from '@/lib/types';
import { Plus, Pencil, Trash2, X, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptyTeamMember = { name: '', role: '', bio: '', image_url: '', sort_order: 0, imageFile: null as File | null };

const AdminTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTeamMember);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchTeam = async () => {
    try {
      const data = await teamAPI.getAllAdmin();
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      toast({ title: 'Error', description: 'Name and role are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    try {
      if (editing) {
        await teamAPI.update(editing, form);
        toast({ title: 'Success', description: 'Team member updated successfully.' });
      } else {
        await teamAPI.create(form);
        toast({ title: 'Success', description: 'Team member created successfully.' });
      }
      
      setShowForm(false);
      setEditing(null);
      setForm(emptyTeamMember);
      fetchTeam();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to save team member.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      sort_order: member.sort_order || 0,
      imageFile: null,
    });
    setEditing(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      await teamAPI.delete(id);
      toast({ title: 'Deleted', description: 'Team member deleted successfully.' });
      fetchTeam();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete team member.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add and manage team members.</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(emptyTeamMember); }}
          className="bg-[#1F2F8F] text-white px-4 py-2 rounded-lg hover:bg-[#2a3a8f] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editing ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none"
                  rows={3}
                  placeholder="Brief biography or description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setForm(p => ({ ...p, imageFile: e.target.files?.[0] || null }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none"
                  />
                  {form.imageFile && <p className="text-xs text-gray-500 mt-1">Selected: {form.imageFile.name}</p>}
                  {editing && !form.imageFile && <p className="text-xs text-gray-500 mt-1">Current image will be kept unless new image is selected</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1F2F8F] text-white px-4 py-2 rounded-lg hover:bg-[#2a3a8f] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editing ? 'Update' : 'Save'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Sort Order</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : team.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No team members found.</td></tr>
              ) : (
                team.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1F2F8F] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.image_url ? (
                            <img src={getImageUrl(member.image_url)} alt={member.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{member.name}</p>
                          {member.bio && <p className="text-xs text-gray-500 line-clamp-1">{member.bio}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{member.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{member.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(member)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default AdminTeam;
