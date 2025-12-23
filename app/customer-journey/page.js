'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import CustomerJourneyTimeline from '@/components/customer-journey/CustomerJourneyTimeline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search } from 'lucide-react';

function CustomerJourneyContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIdentifier(searchTerm.trim());
      setError(null);
    } else {
      setError('Please enter a contact identifier or email');
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Journey</h1>
              <p className="text-gray-600">Track individual customer interactions across all workflows</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter contact identifier or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {identifier && <CustomerJourneyTimeline identifier={identifier} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CustomerJourneyPage() {
  return (
    <ProtectedRoute>
      <CustomerJourneyContent />
    </ProtectedRoute>
  );
}