import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BRAND } from '@/lib/constants';
import { LayoutDashboard, Wrench, FolderOpen, Star, MessageSquare, Users, Settings, LogOut, Menu, X, ChevronRight, User } from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Services', path: '/admin/services', icon: Wrench },
  { label: 'Projects', path: '/admin/projects', icon: FolderOpen },
  { label: 'Reviews', path: '/admin/reviews', icon: Star },
  { label: 'Contacts', path: '/admin/contacts', icon: MessageSquare },
  { label: 'Team', path: '/admin/team', icon: User },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#1F2F8F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0D1B4A] text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img src={BRAND.logo} alt={BRAND.name} className="h-10 w-auto rounded" />
            <div>
              <h2 className="font-bold text-sm">NICKZTECH</h2>
              <p className="text-[#F5A623] text-[10px]">ADMIN PANEL</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? 'bg-[#F5A623] text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#F5A623] rounded-full flex items-center justify-center font-bold text-sm">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-400 capitalize">{profile?.role?.replace('_', ' ') || 'Admin'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Link to="/admin" className="hover:text-[#1F2F8F]">Admin</Link>
                {location.pathname !== '/admin' && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#1F2F8F] font-medium capitalize">
                      {location.pathname.split('/').pop()?.replace('-', ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Link to="/" target="_blank" className="text-sm text-[#1F2F8F] hover:text-[#F5A623] font-medium">
              View Website
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
