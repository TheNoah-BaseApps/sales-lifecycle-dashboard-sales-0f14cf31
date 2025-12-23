'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import MetricsCard from '@/components/dashboard/MetricsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Store, UserCheck, TrendingUp, TrendingDown } from 'lucide-react';

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/summary', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome to your Sales Lifecycle Dashboard</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : data ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricsCard
                    title="Website Visits"
                    value={data.metrics.totalWebsiteVisits}
                    subtitle={`${data.metrics.uniqueWebsiteVisitors} unique visitors`}
                    icon={Globe}
                    color="blue"
                  />
                  <MetricsCard
                    title="Store Visits"
                    value={data.metrics.totalStoreVisits}
                    subtitle={`${data.metrics.uniqueStoreVisitors} unique visitors`}
                    icon={Store}
                    color="green"
                  />
                  <MetricsCard
                    title="Customer Signups"
                    value={data.metrics.totalSignups}
                    subtitle={`${data.metrics.uniqueSignups} unique signups`}
                    icon={UserCheck}
                    color="purple"
                  />
                  <MetricsCard
                    title="Overall Conversion"
                    value={`${data.metrics.websiteToStoreConversion}%`}
                    subtitle="Website to Store"
                    icon={data.metrics.websiteToStoreConversion >= 50 ? TrendingUp : TrendingDown}
                    color={data.metrics.websiteToStoreConversion >= 50 ? 'green' : 'orange'}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Metrics</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Website → Store</span>
                          <span className="text-sm font-bold text-blue-600">
                            {data.metrics.websiteToStoreConversion}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(data.metrics.websiteToStoreConversion, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Store → Signup</span>
                          <span className="text-sm font-bold text-green-600">
                            {data.metrics.storeToSignupConversion}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(data.metrics.storeToSignupConversion, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <ActivityFeed activities={data.recentActivities} />
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}