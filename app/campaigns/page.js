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
import { Search, Plus, TrendingUp, DollarSign, Eye, MousePointerClick } from 'lucide-react';

function CampaignsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/campaigns', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const result = await response.json();
      setCampaigns(result.data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(item =>
    item.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.campaign_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.channel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const avgEngagement = campaigns.length > 0
    ? campaigns.filter(c => c.engagement_rate).map(c => parseFloat(c.engagement_rate) || 0).reduce((a, b) => a + b, 0) / campaigns.filter(c => c.engagement_rate).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaigns</h1>
                <p className="text-gray-600">Marketing campaign tracking and analytics</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <MousePointerClick className="h-4 w-4 mr-2 text-green-600" />
                    <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                    <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by campaign name, type, or channel..."
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
            ) : filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
                  <p className="text-gray-600 mb-4">Start by creating your first marketing campaign</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{campaign.campaign_name}</CardTitle>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2">
                              {campaign.campaign_type && <Badge variant="outline">{campaign.campaign_type}</Badge>}
                              {campaign.channel && <Badge>{campaign.channel}</Badge>}
                            </div>
                          </CardDescription>
                        </div>
                        {campaign.roi && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">ROI</p>
                            <p className="text-lg font-bold text-green-600">{campaign.roi}</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {campaign.impressions !== null && (
                          <div>
                            <p className="text-xs text-gray-500">Impressions</p>
                            <p className="text-sm font-medium">{campaign.impressions?.toLocaleString()}</p>
                          </div>
                        )}
                        {campaign.clicks !== null && (
                          <div>
                            <p className="text-xs text-gray-500">Clicks</p>
                            <p className="text-sm font-medium">{campaign.clicks?.toLocaleString()}</p>
                          </div>
                        )}
                        {campaign.engagement_rate && (
                          <div>
                            <p className="text-xs text-gray-500">Engagement</p>
                            <p className="text-sm font-medium">{campaign.engagement_rate}</p>
                          </div>
                        )}
                        {campaign.budget && (
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-sm font-medium">{campaign.budget}</p>
                          </div>
                        )}
                        {campaign.total_purchase && (
                          <div>
                            <p className="text-xs text-gray-500">Total Purchase</p>
                            <p className="text-sm font-medium">{campaign.total_purchase}</p>
                          </div>
                        )}
                      </div>
                      {campaign.cta && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Call to Action</p>
                          <p className="text-sm font-medium">{campaign.cta}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {campaign.likes !== null && <span>👍 {campaign.likes} likes</span>}
                        {campaign.comments !== null && <span>💬 {campaign.comments} comments</span>}
                        {campaign.website_visits_count !== null && <span>🌐 {campaign.website_visits_count} site visits</span>}
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

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <CampaignsContent />
    </ProtectedRoute>
  );
}