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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Building2, Mail, Globe, FileText } from 'lucide-react';
import Link from 'next/link';

function ResearchContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    lead_name: '',
    locations: '',
    contact_address: '',
    contact_email: '',
    revenue: '',
    ceo: '',
    management_team: '',
    public_or_private: '',
    annual_revenue: '',
    annual_profit_loss: '',
    employee_count: '',
    stock_price: '',
    products_or_services: '',
    website: '',
    linkedin_url: '',
    facebook_url: '',
    twitter_handle: '',
    youtube_url: '',
    social_posts: '',
    quarterly_and_annual_documents: '',
    quarterly_and_annual_summary: '',
    news_textual: '',
    social_insights: '',
    legal: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create research entry');
      }

      toast({
        title: 'Success',
        description: 'Research entry created successfully',
      });

      setShowAddModal(false);
      setFormData({
        lead_name: '',
        locations: '',
        contact_address: '',
        contact_email: '',
        revenue: '',
        ceo: '',
        management_team: '',
        public_or_private: '',
        annual_revenue: '',
        annual_profit_loss: '',
        employee_count: '',
        stock_price: '',
        products_or_services: '',
        website: '',
        linkedin_url: '',
        facebook_url: '',
        twitter_handle: '',
        youtube_url: '',
        social_posts: '',
        quarterly_and_annual_documents: '',
        quarterly_and_annual_summary: '',
        news_textual: '',
        social_insights: '',
        legal: ''
      });
      
      fetchResearch();
    } catch (err) {
      console.error('Error creating research:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
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
              <Button onClick={() => setShowAddModal(true)}>
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
                  <Button onClick={() => setShowAddModal(true)}>
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Research Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead_name">Lead Name *</Label>
                <Input
                  id="lead_name"
                  name="lead_name"
                  value={formData.lead_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locations">Locations</Label>
                <Input
                  id="locations"
                  name="locations"
                  value={formData.locations}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_address">Contact Address</Label>
              <Input
                id="contact_address"
                name="contact_address"
                value={formData.contact_address}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ceo">CEO</Label>
                <Input
                  id="ceo"
                  name="ceo"
                  value={formData.ceo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="public_or_private">Public/Private</Label>
                <Input
                  id="public_or_private"
                  name="public_or_private"
                  value={formData.public_or_private}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="management_team">Management Team</Label>
              <Textarea
                id="management_team"
                name="management_team"
                value={formData.management_team}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Revenue</Label>
                <Input
                  id="revenue"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual_revenue">Annual Revenue</Label>
                <Input
                  id="annual_revenue"
                  name="annual_revenue"
                  value={formData.annual_revenue}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual_profit_loss">Annual Profit/Loss</Label>
                <Input
                  id="annual_profit_loss"
                  name="annual_profit_loss"
                  value={formData.annual_profit_loss}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_count">Employee Count</Label>
                <Input
                  id="employee_count"
                  name="employee_count"
                  type="number"
                  value={formData.employee_count}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_price">Stock Price</Label>
              <Input
                id="stock_price"
                name="stock_price"
                value={formData.stock_price}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="products_or_services">Products/Services</Label>
              <Textarea
                id="products_or_services"
                name="products_or_services"
                value={formData.products_or_services}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  type="url"
                  value={formData.facebook_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter_handle">Twitter Handle</Label>
                <Input
                  id="twitter_handle"
                  name="twitter_handle"
                  value={formData.twitter_handle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  type="url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_posts">Social Posts</Label>
              <Textarea
                id="social_posts"
                name="social_posts"
                value={formData.social_posts}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_insights">Social Insights</Label>
              <Textarea
                id="social_insights"
                name="social_insights"
                value={formData.social_insights}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarterly_and_annual_documents">Quarterly and Annual Documents</Label>
              <Textarea
                id="quarterly_and_annual_documents"
                name="quarterly_and_annual_documents"
                value={formData.quarterly_and_annual_documents}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarterly_and_annual_summary">Quarterly and Annual Summary</Label>
              <Textarea
                id="quarterly_and_annual_summary"
                name="quarterly_and_annual_summary"
                value={formData.quarterly_and_annual_summary}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="news_textual">News (Textual)</Label>
              <Textarea
                id="news_textual"
                name="news_textual"
                value={formData.news_textual}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal">Legal</Label>
              <Textarea
                id="legal"
                name="legal"
                value={formData.legal}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Research'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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