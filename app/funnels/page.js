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
import { Search, Plus, Filter, DollarSign, Calendar, User } from 'lucide-react';

function FunnelsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [funnels, setFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchFunnels = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/funnels', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch funnels');
      }

      const result = await response.json();
      setFunnels(result.data || []);
    } catch (err) {
      console.error('Error fetching funnels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunnels = funnels.filter(item => {
    const matchesSearch = item.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || item.stage?.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesStage;
  });

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const getStageCounts = () => {
    const counts = {};
    stages.forEach(stage => {
      counts[stage] = funnels.filter(f => f.stage?.toLowerCase() === stage.toLowerCase()).length;
    });
    return counts;
  };
  const stageCounts = getStageCounts();

  const getStageColor = (stage) => {
    const colors = {
      'lead': 'bg-blue-100 text-blue-800',
      'qualified': 'bg-cyan-100 text-cyan-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-yellow-100 text-yellow-800',
      'closed won': 'bg-green-100 text-green-800',
      'closed lost': 'bg-red-100 text-red-800',
    };
    return colors[stage?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Funnel</h1>
                <p className="text-gray-600">Pipeline management and deal tracking</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              {stages.map((stage) => (
                <Card key={stage} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStageFilter(stage)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium text-gray-600">{stage}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{stageCounts[stage] || 0}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company, contact name, or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setStageFilter('all')}>
                <Filter className="h-4 w-4 mr-2" />
                All Stages
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
              </div>
            ) : filteredFunnels.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities found</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first sales opportunity</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Opportunity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredFunnels.map((funnel) => (
                  <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{funnel.company_name}</CardTitle>
                          <CardDescription className="space-y-1">
                            {funnel.contact_name && (
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2" />
                                {funnel.contact_name}
                                {funnel.contact_email && ` (${funnel.contact_email})`}
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <Badge className={getStageColor(funnel.stage)}>
                          {funnel.stage}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {funnel.value && (
                          <div>
                            <p className="text-xs text-gray-500">Deal Value</p>
                            <p className="text-sm font-medium">{funnel.value}</p>
                          </div>
                        )}
                        {funnel.probability && (
                          <div>
                            <p className="text-xs text-gray-500">Probability</p>
                            <p className="text-sm font-medium">{funnel.probability}</p>
                          </div>
                        )}
                        {funnel.expected_revenue && (
                          <div>
                            <p className="text-xs text-gray-500">Expected Revenue</p>
                            <p className="text-sm font-medium text-green-600">{funnel.expected_revenue}</p>
                          </div>
                        )}
                        {funnel.team_member && (
                          <div>
                            <p className="text-xs text-gray-500">Owner</p>
                            <p className="text-sm font-medium">{funnel.team_member}</p>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {funnel.expected_close_date && (
                          <div>
                            <p className="text-xs text-gray-500">Expected Close Date</p>
                            <p className="text-sm">{new Date(funnel.expected_close_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        {funnel.last_interacted_on && (
                          <div>
                            <p className="text-xs text-gray-500">Last Interaction</p>
                            <p className="text-sm">{new Date(funnel.last_interacted_on).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                      {funnel.next_step && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Next Step</p>
                          <p className="text-sm font-medium">{funnel.next_step}</p>
                        </div>
                      )}
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

export default function FunnelsPage() {
  return (
    <ProtectedRoute>
      <FunnelsContent />
    </ProtectedRoute>
  );
}