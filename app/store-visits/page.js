'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import StoreVisitsTable from '@/components/store-visits/StoreVisitsTable';
import StoreVisitForm from '@/components/store-visits/StoreVisitForm';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Store, Users, MapPin } from 'lucide-react';

function StoreVisitsContent() {
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
      const response = await fetch('/api/store-visits', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch store visits');
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
  const uniqueLocations = new Set(visits.map(v => v.location)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Visits</h1>
                <p className="text-gray-600">Monitor physical store visit patterns</p>
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
                  icon={Store}
                  color="green"
                />
                <MetricsCard
                  title="Unique Visitors"
                  value={uniqueVisitors}
                  icon={Users}
                  color="blue"
                />
                <MetricsCard
                  title="Store Locations"
                  value={uniqueLocations}
                  icon={MapPin}
                  color="purple"
                />
              </div>
            )}

            {showForm && (
              <div className="mb-8">
                <StoreVisitForm
                  onSuccess={handleVisitCreated}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            <StoreVisitsTable visits={visits} onUpdate={fetchVisits} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function StoreVisitsPage() {
  return (
    <ProtectedRoute>
      <StoreVisitsContent />
    </ProtectedRoute>
  );
}