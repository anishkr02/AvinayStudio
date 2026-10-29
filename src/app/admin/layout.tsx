'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  CreditCard,
  FileText,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on /admin/login, don't show shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects CMS', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Clients CRM', href: '/admin/clients', icon: Users },
    { label: 'Payments Tracker', href: '/admin/payments', icon: CreditCard },
    { label: 'Invoices & PDF', href: '/admin/invoices', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem('avinay_studio_auth');
    localStorage.removeItem('avinay_studio_user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#F5F2ED] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between bg-[#0C0C10] border-r border-[#D4C5B9]/10 p-6 shrink-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#141418] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] font-bold text-lg">
              AS
            </div>
            <div>
              <div className="text-base font-bold text-[#F5F2ED] font-['Outfit']">
                AvinayStudio
              </div>
              <div className="text-[10px] tracking-widest text-[#DFC08F] uppercase font-semibold">
                Admin Console
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#181822] text-[#DFC08F] border border-[#C5A880]/40 shadow-sm'
                      : 'text-[#B8B3AB] hover:text-[#F5F2ED] hover:bg-[#121216]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-[#D4C5B9]/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-[#B8B3AB] hover:text-[#DFC08F] hover:bg-[#121216] transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-[#75716B] hover:text-[#DFC08F] hover:bg-[#121216] transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0C0C10] border-b border-[#D4C5B9]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#141418] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] font-bold text-sm">
            AS
          </div>
          <span className="text-sm font-bold text-[#F5F2ED]">AvinayStudio Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#B8B3AB] hover:text-[#DFC08F]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C0C10] border-b border-[#D4C5B9]/10 p-6 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                pathname === item.href ? 'bg-[#181822] text-[#DFC08F]' : 'text-[#B8B3AB]'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </a>
          ))}
          <div className="pt-4 border-t border-[#D4C5B9]/10 flex flex-col gap-2">
            <a href="/" className="text-xs text-[#DFC08F]">View Live Portfolio →</a>
            <button onClick={handleLogout} className="text-xs text-left text-[#75716B]">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
