'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Phone, Calendar, Clock, TrendingUp, TrendingDown, Minus, Mic, FileText } from 'lucide-react';

export default function CallInteractionsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    email_ids: '',
    name: '',
    call_duration: '',
    voice_recordings: '',
    transcripts: '',
    summary: '',
    sentiment: 'neutral',
    action_items: '',
    purchase_intent_score: 0,
    sales_highlights: ''
  });

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    try {
      const res = await fetch('/api/call-interactions');
      const data = await res.json();
      if (data.success) {
        setCalls(data.data);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/call-interactions/${editingId}` 
        : '/api/call-interactions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        fetchCalls();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving call:', error);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this call interaction?')) return;
    
    try {
      const res = await fetch(`/api/call-interactions/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchCalls();
      }
    } catch (error) {
      console.error('Error deleting call:', error);
    }
  }

  function handleEdit(call) {
    setFormData({
      time: call.time || '',
      date: call.date || '',
      email_ids: call.email_ids || '',
      name: call.name || '',
      call_duration: call.call_duration || '',
      voice_recordings: call.voice_recordings || '',
      transcripts: call.transcripts || '',
      summary: call.summary || '',
      sentiment: call.sentiment || 'neutral',
      action_items: call.action_items || '',
      purchase_intent_score: call.purchase_intent_score || 0,
      sales_highlights: call.sales_highlights || ''
    });
    setEditingId(call.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      time: '',
      date: '',
      email_ids: '',
      name: '',
      call_duration: '',
      voice_recordings: '',
      transcripts: '',
      summary: '',
      sentiment: 'neutral',
      action_items: '',
      purchase_intent_score: 0,
      sales_highlights: ''
    });
    setEditingId(null);
    setShowForm(false);
  }

  function getSentimentIcon(sentiment) {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading call interactions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Interactions</h1>
          <p className="text-muted-foreground">Track and analyze phone calls with AI insights</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Log Call'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Call Interaction' : 'Log Call Interaction'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_ids">Email IDs</Label>
                  <Input
                    id="email_ids"
                    value={formData.email_ids}
                    onChange={(e) => setFormData({ ...formData, email_ids: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call_duration">Call Duration</Label>
                  <Input
                    id="call_duration"
                    placeholder="e.g., 15m 30s"
                    value={formData.call_duration}
                    onChange={(e) => setFormData({ ...formData, call_duration: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentiment">Sentiment</Label>
                  <select
                    id="sentiment"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.sentiment}
                    onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_intent_score">Purchase Intent Score (0-100)</Label>
                  <Input
                    id="purchase_intent_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.purchase_intent_score}
                    onChange={(e) => setFormData({ ...formData, purchase_intent_score: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice_recordings">Voice Recording URL</Label>
                  <Input
                    id="voice_recordings"
                    placeholder="https://..."
                    value={formData.voice_recordings}
                    onChange={(e) => setFormData({ ...formData, voice_recordings: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transcripts">Transcript</Label>
                <Textarea
                  id="transcripts"
                  rows={4}
                  value={formData.transcripts}
                  onChange={(e) => setFormData({ ...formData, transcripts: e.target.value })}
                  placeholder="AI-generated transcript..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="AI-generated summary..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action_items">Action Items</Label>
                <Textarea
                  id="action_items"
                  rows={3}
                  value={formData.action_items}
                  onChange={(e) => setFormData({ ...formData, action_items: e.target.value })}
                  placeholder="Follow-up tasks..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales_highlights">Sales Highlights</Label>
                <Textarea
                  id="sales_highlights"
                  rows={3}
                  value={formData.sales_highlights}
                  onChange={(e) => setFormData({ ...formData, sales_highlights: e.target.value })}
                  placeholder="Key talking points..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {calls.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No call interactions yet</h3>
            <p className="text-muted-foreground mb-4">Start logging call interactions to track conversations</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Call
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {calls.map((call) => (
            <Card key={call.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {call.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {call.email_ids && `Email: ${call.email_ids}`}
                      {call.call_duration && ` • Duration: ${call.call_duration}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(call.sentiment)}
                    <Badge variant="outline">{call.sentiment}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {call.purchase_intent_score !== null && call.purchase_intent_score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Purchase Intent</span>
                      <span className="text-muted-foreground">{call.purchase_intent_score}%</span>
                    </div>
                    <Progress value={call.purchase_intent_score} className="h-2" />
                  </div>
                )}
                {call.summary && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Summary:</p>
                    <p className="text-sm text-muted-foreground">{call.summary}</p>
                  </div>
                )}
                {call.action_items && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Action Items:</p>
                    <p className="text-sm text-muted-foreground">{call.action_items}</p>
                  </div>
                )}
                {call.sales_highlights && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Sales Highlights:</p>
                    <p className="text-sm text-muted-foreground">{call.sales_highlights}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {call.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(call.date).toLocaleDateString()}
                    </div>
                  )}
                  {call.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {call.time}
                    </div>
                  )}
                  {call.voice_recordings && (
                    <div className="flex items-center gap-1">
                      <Mic className="h-4 w-4" />
                      Recording
                    </div>
                  )}
                  {call.transcripts && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Transcript
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(call)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(call.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}