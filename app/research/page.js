'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Building2, Mail, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

function ResearchContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/research', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch research data');
      }

      const result = await response.json();
      setResearch(result.data || []);
    } catch (err) {
      console.error('Error fetching research:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResearch = research.filter(item =>
    item.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.locations?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Research</h1>
                <p className="text-gray-600">Lead intelligence and market analysis</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Research
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{research.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Public Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {research.filter(r => r.public_or_private?.toLowerCase() === 'public').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Private Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {research.filter(r => r.public_or_private?.toLowerCase() === 'private').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">With Social Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {research.filter(r => r.social_posts || r.social_insights).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lead name, email, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-48" />)}
              </div>
            ) : filteredResearch.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No research data found</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first lead research entry</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Research
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredResearch.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{item.lead_name}</CardTitle>
                          <CardDescription className="space-y-1">
                            {item.contact_email && (
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2" />
                                {item.contact_email}
                              </div>
                            )}
                            {item.website && (
                              <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2" />
                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {item.website}
                                </a>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        {item.public_or_private && (
                          <Badge variant={item.public_or_private.toLowerCase() === 'public' ? 'default' : 'secondary'}>
                            {item.public_or_private}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {item.locations && (
                          <div>
                            <p className="text-xs text-gray-500">Locations</p>
                            <p className="text-sm font-medium">{item.locations}</p>
                          </div>
                        )}
                        {item.employee_count && (
                          <div>
                            <p className="text-xs text-gray-500">Employees</p>
                            <p className="text-sm font-medium">{item.employee_count.toLocaleString()}</p>
                          </div>
                        )}
                        {item.annual_revenue && (
                          <div>
                            <p className="text-xs text-gray-500">Annual Revenue</p>
                            <p className="text-sm font-medium">{item.annual_revenue}</p>
                          </div>
                        )}
                        {item.ceo && (
                          <div>
                            <p className="text-xs text-gray-500">CEO</p>
                            <p className="text-sm font-medium">{item.ceo}</p>
                          </div>
                        )}
                      </div>
                      {item.products_or_services && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Products/Services</p>
                          <p className="text-sm">{item.products_or_services}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {item.linkedin_url && (
                          <a href={item.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">LinkedIn</Badge>
                          </a>
                        )}
                        {item.twitter_handle && (
                          <Badge variant="outline">Twitter</Badge>
                        )}
                        {item.facebook_url && (
                          <Badge variant="outline">Facebook</Badge>
                        )}
                        {item.quarterly_and_annual_documents && (
                          <Badge variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Financial Docs
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <ProtectedRoute>
      <ResearchContent />
    </ProtectedRoute>
  );
}