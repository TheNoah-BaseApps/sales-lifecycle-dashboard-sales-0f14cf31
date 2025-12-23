'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import WebsiteVisitsTable from '@/components/website-visits/WebsiteVisitsTable';
import WebsiteVisitForm from '@/components/website-visits/WebsiteVisitForm';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Globe, Eye, Clock } from 'lucide-react';

function WebsiteVisitsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/website-visits', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch website visits');
      }

      const result = await response.json();
      setVisits(result.data);
    } catch (err) {
      console.error('Error fetching visits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitCreated = () => {
    setShowForm(false);
    fetchVisits();
  };

  const canCreate = user && ['admin', 'manager'].includes(user.role);

  const totalVisits = visits.length;
  const uniqueVisitors = new Set(visits.map(v => v.owner_contact)).size;
  const avgDuration = visits.length > 0
    ? Math.round(visits.reduce((sum, v) => sum + (v.website_duration || 0), 0) / visits.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Visits</h1>
                <p className="text-gray-600">Track and analyze website visitor behavior</p>
              </div>
              {canCreate && (
                <Button onClick={() => setShowForm(!showForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Visit
                </Button>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricsCard
                  title="Total Visits"
                  value={totalVisits}
                  icon={Globe}
                  color="blue"
                />
                <MetricsCard
                  title="Unique Visitors"
                  value={uniqueVisitors}
                  icon={Eye}
                  color="green"
                />
                <MetricsCard
                  title="Avg Duration"
                  value={`${avgDuration}s`}
                  icon={Clock}
                  color="purple"
                />
              </div>
            )}

            {showForm && (
              <div className="mb-8">
                <WebsiteVisitForm
                  onSuccess={handleVisitCreated}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            <WebsiteVisitsTable visits={visits} onUpdate={fetchVisits} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function WebsiteVisitsPage() {
  return (
    <ProtectedRoute>
      <WebsiteVisitsContent />
    </ProtectedRoute>
  );
}