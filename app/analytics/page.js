'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import FunnelVisualization from '@/components/analytics/FunnelVisualization';
import TrendChart from '@/components/analytics/TrendChart';
import DateRangePicker from '@/components/shared/DateRangePicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getDefaultDateRange } from '@/lib/utils';

function AnalyticsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [funnelData, setFunnelData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user && ['admin', 'manager', 'analyst'].includes(user.role)) {
      fetchAnalytics();
    }
  }, [dateRange, user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });

      const [funnelResponse, trendsResponse] = await Promise.all([
        fetch(`/api/analytics/funnel?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`/api/analytics/trends?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!funnelResponse.ok || !trendsResponse.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const funnelResult = await funnelResponse.json();
      const trendsResult = await trendsResponse.json();

      setFunnelData(funnelResult.data);
      setTrendData(trendsResult.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canViewAnalytics = user && ['admin', 'manager', 'analyst'].includes(user.role);

  if (!canViewAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex pt-16">
          <Sidebar open={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
            <div className="p-8">
              <Alert variant="destructive">
                <AlertDescription>
                  You do not have permission to view analytics. Contact your administrator.
                </AlertDescription>
              </Alert>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-gray-600">Visualize conversion rates and trends</p>
            </div>

            <div className="mb-6">
              <DateRangePicker
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={setDateRange}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </div>
            ) : (
              <div className="space-y-6">
                {funnelData && <FunnelVisualization data={funnelData} />}
                {trendData && <TrendChart data={trendData} />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}