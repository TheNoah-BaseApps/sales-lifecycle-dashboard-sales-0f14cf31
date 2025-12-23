'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Target, Plus, Search, TrendingUp, Globe, DollarSign } from 'lucide-react';
import AppBar from '@/components/AppBar';
import Sidebar from '@/components/Sidebar';

export default function CompetitionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    withPricing: 0,
    withWebsiteData: 0,
    withSocialData: 0
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  async function fetchCompetitions() {
    try {
      setLoading(true);
      const res = await fetch('/api/competitions');
      const data = await res.json();
      
      if (data.success) {
        setCompetitions(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data) {
    const total = data.length;
    const withPricing = data.filter(c => c.pricing).length;
    const withWebsiteData = data.filter(c => c.website_visits_data).length;
    const withSocialData = data.filter(c => c.social_data).length;
    
    setStats({ total, withPricing, withWebsiteData, withSocialData });
  }

  const filteredCompetitions = competitions.filter(comp =>
    comp.similar_tools?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="container mx-auto p-8 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading competitive analysis...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Competitive Analysis</h1>
                    <p className="text-muted-foreground">Track and analyze competitor tools and market positioning</p>
                  </div>
                  <Button asChild>
                    <Link href="/competitions/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Competitor
                    </Link>
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Competitors</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">Tracked competitors</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pricing Data</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.withPricing}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.total > 0 ? ((stats.withPricing / stats.total) * 100).toFixed(0) : 0}% have pricing
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Website Analytics</CardTitle>
                      <Globe className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.withWebsiteData}</div>
                      <p className="text-xs text-muted-foreground">With traffic data</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Social Presence</CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.withSocialData}</div>
                      <p className="text-xs text-muted-foreground">Tracked on social</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search competitors by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Competitions List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Competitor Analysis</CardTitle>
                    <CardDescription>
                      {filteredCompetitions.length} competitor{filteredCompetitions.length !== 1 ? 's' : ''} tracked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredCompetitions.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No competitors tracked</h3>
                        <p className="text-muted-foreground">Start analyzing your competition by adding competitor data.</p>
                        <Button asChild className="mt-4">
                          <Link href="/competitions/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Competitor
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredCompetitions.map((comp) => (
                          <Card key={comp.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{comp.similar_tools}</h3>
                                    {comp.pricing && (
                                      <Badge variant="outline">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        {comp.pricing}
                                      </Badge>
                                    )}
                                  </div>
                                  {comp.web_url && (
                                    <a 
                                      href={comp.web_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                      <Globe className="h-3 w-3" />
                                      {comp.web_url}
                                    </a>
                                  )}
                                  <p className="text-sm text-muted-foreground">{comp.description || 'No description available'}</p>
                                  {comp.features && (
                                    <div className="text-sm">
                                      <strong>Features:</strong> {comp.features}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    {comp.website_visits_data && (
                                      <Badge variant="secondary">📊 Traffic Data</Badge>
                                    )}
                                    {comp.social_data && (
                                      <Badge variant="secondary">📱 Social Data</Badge>
                                    )}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/competitions/${comp.id}`}>View Details</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}