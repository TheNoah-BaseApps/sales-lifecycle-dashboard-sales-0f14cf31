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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Filter, DollarSign, Calendar, User } from 'lucide-react';

function FunnelsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [funnels, setFunnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    stage: '',
    value: '',
    probability: '',
    expected_revenue: '',
    creation_date: '',
    expected_close_date: '',
    team_member: '',
    progress_to_won: '',
    last_interacted_on: '',
    next_step: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/funnels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create funnel');
      }

      toast({
        title: 'Success',
        description: 'Funnel opportunity created successfully',
      });

      setShowAddModal(false);
      setFormData({
        company_name: '',
        contact_name: '',
        contact_email: '',
        stage: '',
        value: '',
        probability: '',
        expected_revenue: '',
        creation_date: '',
        expected_close_date: '',
        team_member: '',
        progress_to_won: '',
        last_interacted_on: '',
        next_step: '',
      });
      
      fetchFunnels();
    } catch (err) {
      console.error('Error creating funnel:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
              <Button onClick={() => setShowAddModal(true)}>
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
                  <Button onClick={() => setShowAddModal(true)}>
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Opportunity</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="stage">Stage *</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange('stage', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value</Label>
                <Input
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="e.g., $50,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  name="probability"
                  value={formData.probability}
                  onChange={handleInputChange}
                  placeholder="e.g., 75%"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expected_revenue">Expected Revenue</Label>
                <Input
                  id="expected_revenue"
                  name="expected_revenue"
                  value={formData.expected_revenue}
                  onChange={handleInputChange}
                  placeholder="e.g., $37,500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_member">Team Member</Label>
                <Input
                  id="team_member"
                  name="team_member"
                  value={formData.team_member}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creation_date">Creation Date</Label>
                <Input
                  id="creation_date"
                  name="creation_date"
                  type="date"
                  value={formData.creation_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_close_date">Expected Close Date</Label>
                <Input
                  id="expected_close_date"
                  name="expected_close_date"
                  type="date"
                  value={formData.expected_close_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_interacted_on">Last Interaction Date</Label>
                <Input
                  id="last_interacted_on"
                  name="last_interacted_on"
                  type="date"
                  value={formData.last_interacted_on}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress_to_won">Progress to Won (%)</Label>
                <Input
                  id="progress_to_won"
                  name="progress_to_won"
                  value={formData.progress_to_won}
                  onChange={handleInputChange}
                  placeholder="e.g., 60%"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_step">Next Step</Label>
              <Textarea
                id="next_step"
                name="next_step"
                value={formData.next_step}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe the next action or milestone..."
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
                {submitting ? 'Creating...' : 'Create Opportunity'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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