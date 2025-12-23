'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Search, TrendingUp, Users, Clock } from 'lucide-react';
import AppBar from '@/components/AppBar';
import Sidebar from '@/components/Sidebar';

export default function ChatInteractionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    avgPurchaseIntent: 0
  });

  useEffect(() => {
    fetchInteractions();
  }, [sentimentFilter]);

  async function fetchInteractions() {
    try {
      setLoading(true);
      const url = sentimentFilter !== 'all' 
        ? `/api/chat-interactions?sentiment=${sentimentFilter}`
        : '/api/chat-interactions';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setInteractions(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching chat interactions:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data) {
    const total = data.length;
    const positive = data.filter(i => i.sentiment === 'positive').length;
    const neutral = data.filter(i => i.sentiment === 'neutral').length;
    const negative = data.filter(i => i.sentiment === 'negative').length;
    const avgPurchaseIntent = data.reduce((acc, i) => acc + (i.purchase_intent_score || 0), 0) / total || 0;
    
    setStats({ total, positive, neutral, negative, avgPurchaseIntent: avgPurchaseIntent.toFixed(1) });
  }

  const filteredInteractions = interactions.filter(interaction =>
    interaction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interaction.email_ids?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar open={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
            <div className="container mx-auto p-8">
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading chat interactions...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="container mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chat Interactions</h1>
                <p className="text-muted-foreground">Track and analyze customer chat conversations</p>
              </div>
              <Button asChild>
                <Link href="/chat-interactions/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Interaction
                </Link>
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">All interactions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Positive</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.positive}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? ((stats.positive / stats.total) * 100).toFixed(1) : 0}% of total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Purchase Intent</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgPurchaseIntent}/10</div>
                  <p className="text-xs text-muted-foreground">Intent score</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total > 0 ? 'Active' : 'None'}</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interactions List */}
            <Card>
              <CardHeader>
                <CardTitle>All Chat Interactions</CardTitle>
                <CardDescription>
                  {filteredInteractions.length} interaction{filteredInteractions.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredInteractions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No chat interactions found</h3>
                    <p className="text-muted-foreground">Get started by adding your first chat interaction.</p>
                    <Button asChild className="mt-4">
                      <Link href="/chat-interactions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Interaction
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredInteractions.map((interaction) => (
                      <Card key={interaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-lg">{interaction.name}</h3>
                                <Badge className={getSentimentColor(interaction.sentiment)}>
                                  {interaction.sentiment || 'N/A'}
                                </Badge>
                                {interaction.purchase_intent_score && (
                                  <Badge variant="outline">
                                    Intent: {interaction.purchase_intent_score}/10
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{interaction.email_ids}</p>
                              <p className="text-sm">{interaction.summary || 'No summary available'}</p>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                {interaction.date && (
                                  <span>📅 {new Date(interaction.date).toLocaleDateString()}</span>
                                )}
                                {interaction.chat_duration && (
                                  <span>⏱️ {interaction.chat_duration}</span>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/chat-interactions/${interaction.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}