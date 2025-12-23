'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Globe, Store, UserCheck, TrendingUp, Route, Users, Mail as MailIcon, Inbox as InboxIcon, Phone as PhoneIcon } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Website Visits', href: '/website-visits', icon: Globe },
  { name: 'Store Visits', href: '/store-visits', icon: Store },
  { name: 'Customer Signups', href: '/login-signups', icon: UserCheck },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Customer Journey', href: '/customer-journey', icon: Route },
  { name: 'User Management', href: '/user-management', icon: Users },
  { name: 'Newsletter Blogs', href: '/newsletter-blogs', icon: MailIcon },
  { name: 'Email Interactions', href: '/email-interactions', icon: InboxIcon },
  { name: 'Call Interactions', href: '/call-interactions', icon: PhoneIcon },
];

export default function Sidebar({ open }) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          'fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="h-full overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {}}
        />
      )}
    </>
  );
}