import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, BarChart3, Plus, History, FileText } from 'lucide-react';

export const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
      isActive
        ? 'text-[#4F8EF7] bg-[#4F8EF7]/10'
        : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111827]'
    }`;

  return (
    <div className="h-full flex flex-col bg-[#0A0E1A] border-r border-[#1E2D45]">
      {/* Logo section */}
      <div className="p-6 border-b border-[#1E2D45]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#F1F5F9]">AdsPulse</span>
            <span className="text-xs text-[#475569]">Diagnostic Engine</span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-4 px-2">
            Main
          </p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
              <Plus className="w-5 h-5" />
              <span>New Analysis</span>
            </NavLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-4 px-2">
            History
          </p>
          <div className="space-y-1">
            <NavLink to="/history" className={navLinkClass} onClick={onClose}>
              <History className="w-5 h-5" />
              <span>Past Analyses</span>
            </NavLink>
            <NavLink to="/history" className={navLinkClass} onClick={onClose}>
              <FileText className="w-5 h-5" />
              <span>Reports</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* User profile + logout */}
      <div className="p-6 border-t border-[#1E2D45] space-y-3">
        <div className="px-4 py-3 bg-[#111827] rounded-lg border border-[#1E2D45]">
          <p className="text-xs text-[#475569] mb-1">Logged in as</p>
          <p className="text-sm font-medium text-[#F1F5F9] truncate">{user?.email}</p>
          <p className="text-xs text-[#475569] mt-1 capitalize">
            Plan: <span className="text-[#34D399]">{user?.plan || 'free'}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-[#F87171] hover:bg-[#F87171]/10 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
