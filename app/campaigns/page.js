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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, TrendingUp, DollarSign, Eye, MousePointerClick } from 'lucide-react';

function CampaignsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    campaign_name: '',
    campaign_type: '',
    channel: '',
    likes: '',
    comments: '',
    budget: '',
    budget_remaining: '',
    impressions: '',
    open_rate: '',
    clicks: '',
    cta: '',
    roi: '',
    engagement_rate: '',
    cart_abandonment: '',
    total_purchase: '',
    avg_purchase_value: '',
    website_visits_count: '',
    store_visits_count: '',
    ecommerce_visits_count: '',
    social_visit_counts: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        campaign_name: formData.campaign_name,
        campaign_type: formData.campaign_type || null,
        channel: formData.channel || null,
        likes: formData.likes ? parseInt(formData.likes) : null,
        comments: formData.comments ? parseInt(formData.comments) : null,
        budget: formData.budget || null,
        budget_remaining: formData.budget_remaining || null,
        impressions: formData.impressions ? parseInt(formData.impressions) : null,
        open_rate: formData.open_rate || null,
        clicks: formData.clicks ? parseInt(formData.clicks) : null,
        cta: formData.cta || null,
        roi: formData.roi || null,
        engagement_rate: formData.engagement_rate || null,
        cart_abandonment: formData.cart_abandonment || null,
        total_purchase: formData.total_purchase || null,
        avg_purchase_value: formData.avg_purchase_value || null,
        website_visits_count: formData.website_visits_count ? parseInt(formData.website_visits_count) : null,
        store_visits_count: formData.store_visits_count ? parseInt(formData.store_visits_count) : null,
        ecommerce_visits_count: formData.ecommerce_visits_count ? parseInt(formData.ecommerce_visits_count) : null,
        social_visit_counts: formData.social_visit_counts ? parseInt(formData.social_visit_counts) : null
      };

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      toast({
        title: 'Success',
        description: 'Campaign created successfully'
      });

      setShowAddModal(false);
      setFormData({
        campaign_name: '',
        campaign_type: '',
        channel: '',
        likes: '',
        comments: '',
        budget: '',
        budget_remaining: '',
        impressions: '',
        open_rate: '',
        clicks: '',
        cta: '',
        roi: '',
        engagement_rate: '',
        cart_abandonment: '',
        total_purchase: '',
        avg_purchase_value: '',
        website_visits_count: '',
        store_visits_count: '',
        ecommerce_visits_count: '',
        social_visit_counts: ''
      });
      
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
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
              <Button onClick={() => setShowAddModal(true)}>
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
                  <Button onClick={() => setShowAddModal(true)}>
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign_name">Campaign Name *</Label>
                <Input
                  id="campaign_name"
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign_type">Campaign Type</Label>
                <Input
                  id="campaign_type"
                  name="campaign_type"
                  value={formData.campaign_type}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Input
                  id="channel"
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="likes">Likes</Label>
                <Input
                  id="likes"
                  name="likes"
                  type="number"
                  value={formData.likes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  name="comments"
                  type="number"
                  value={formData.comments}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_remaining">Budget Remaining</Label>
                <Input
                  id="budget_remaining"
                  name="budget_remaining"
                  value={formData.budget_remaining}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impressions">Impressions</Label>
                <Input
                  id="impressions"
                  name="impressions"
                  type="number"
                  value={formData.impressions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="open_rate">Open Rate</Label>
                <Input
                  id="open_rate"
                  name="open_rate"
                  value={formData.open_rate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clicks">Clicks</Label>
                <Input
                  id="clicks"
                  name="clicks"
                  type="number"
                  value={formData.clicks}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta">Call to Action</Label>
                <Input
                  id="cta"
                  name="cta"
                  value={formData.cta}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roi">ROI</Label>
                <Input
                  id="roi"
                  name="roi"
                  value={formData.roi}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement_rate">Engagement Rate</Label>
                <Input
                  id="engagement_rate"
                  name="engagement_rate"
                  value={formData.engagement_rate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cart_abandonment">Cart Abandonment</Label>
                <Input
                  id="cart_abandonment"
                  name="cart_abandonment"
                  value={formData.cart_abandonment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_purchase">Total Purchase</Label>
                <Input
                  id="total_purchase"
                  name="total_purchase"
                  value={formData.total_purchase}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avg_purchase_value">Avg Purchase Value</Label>
                <Input
                  id="avg_purchase_value"
                  name="avg_purchase_value"
                  value={formData.avg_purchase_value}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_visits_count">Website Visits</Label>
                <Input
                  id="website_visits_count"
                  name="website_visits_count"
                  type="number"
                  value={formData.website_visits_count}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="store_visits_count">Store Visits</Label>
                <Input
                  id="store_visits_count"
                  name="store_visits_count"
                  type="number"
                  value={formData.store_visits_count}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ecommerce_visits_count">Ecommerce Visits</Label>
                <Input
                  id="ecommerce_visits_count"
                  name="ecommerce_visits_count"
                  type="number"
                  value={formData.ecommerce_visits_count}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_visit_counts">Social Visit Counts</Label>
                <Input
                  id="social_visit_counts"
                  name="social_visit_counts"
                  type="number"
                  value={formData.social_visit_counts}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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