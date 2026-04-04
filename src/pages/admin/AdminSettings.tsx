import React, { useEffect, useState } from 'react';
import { settingsAPI } from '@/lib/api';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.getAll();
      const map: Record<string, string> = {};
      data.forEach(s => { map[s.key] = s.value; });
      setSettings(map);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        settingsAPI.set(key, value)
      );
      await Promise.all(promises);
      toast({ title: 'Success', description: 'Settings have been saved successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-[#1F2F8F] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Update contact information and social media links.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2F8F] text-white rounded-lg hover:bg-[#2E3FBF] transition-colors text-sm font-medium disabled:opacity-50">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={settings.email || ''} onChange={e => updateSetting('email', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 1</label>
              <input type="text" value={settings.phone1 || ''} onChange={e => updateSetting('phone1', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label>
              <input type="text" value={settings.phone2 || ''} onChange={e => updateSetting('phone2', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="text" value={settings.whatsapp || ''} onChange={e => updateSetting('whatsapp', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={settings.address || ''} onChange={e => updateSetting('address', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" value={settings.facebook || ''} onChange={e => updateSetting('facebook', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" value={settings.instagram || ''} onChange={e => updateSetting('instagram', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Branding</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input type="text" value={settings.tagline || ''} onChange={e => updateSetting('tagline', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F2F8F] outline-none text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
