'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import LoginSignupsTable from '@/components/login-signups/LoginSignupsTable';
import LoginSignupForm from '@/components/login-signups/LoginSignupForm';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, UserCheck, Mail, MapPin } from 'lucide-react';

function LoginSignupsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/login-signups', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch signups');
      }

      const result = await response.json();
      setSignups(result.data);
    } catch (err) {
      console.error('Error fetching signups:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupCreated = () => {
    setShowForm(false);
    fetchSignups();
  };

  const canCreate = user && ['admin', 'manager'].includes(user.role);

  const totalSignups = signups.length;
  const uniqueEmails = new Set(signups.map(s => s.email)).size;
  const uniqueLocations = new Set(signups.map(s => s.location)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Signups</h1>
                <p className="text-gray-600">Track customer account creation and registration</p>
              </div>
              {canCreate && (
                <Button onClick={() => setShowForm(!showForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Signup
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
                  title="Total Signups"
                  value={totalSignups}
                  icon={UserCheck}
                  color="purple"
                />
                <MetricsCard
                  title="Unique Emails"
                  value={uniqueEmails}
                  icon={Mail}
                  color="blue"
                />
                <MetricsCard
                  title="Locations"
                  value={uniqueLocations}
                  icon={MapPin}
                  color="green"
                />
              </div>
            )}

            {showForm && (
              <div className="mb-8">
                <LoginSignupForm
                  onSuccess={handleSignupCreated}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            <LoginSignupsTable signups={signups} onUpdate={fetchSignups} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LoginSignupsPage() {
  return (
    <ProtectedRoute>
      <LoginSignupsContent />
    </ProtectedRoute>
  );
}