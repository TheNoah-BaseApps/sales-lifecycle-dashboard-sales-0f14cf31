'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Mail, Paperclip, Calendar, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function EmailInteractionsPage() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email_ids: '',
    email_domain: '',
    subject: '',
    message: '',
    attachments: '',
    time: '',
    date: '',
    thread: '',
    summary: '',
    sentiment: 'neutral',
    sender_id: '',
    receiver_id: '',
    cc_id: ''
  });

  useEffect(() => {
    fetchInteractions();
  }, []);

  async function fetchInteractions() {
    try {
      const res = await fetch('/api/email-interactions');
      const data = await res.json();
      if (data.success) {
        setInteractions(data.data);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/email-interactions/${editingId}` 
        : '/api/email-interactions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        fetchInteractions();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving interaction:', error);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this email interaction?')) return;
    
    try {
      const res = await fetch(`/api/email-interactions/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchInteractions();
      }
    } catch (error) {
      console.error('Error deleting interaction:', error);
    }
  }

  function handleEdit(interaction) {
    setFormData({
      email_ids: interaction.email_ids || '',
      email_domain: interaction.email_domain || '',
      subject: interaction.subject || '',
      message: interaction.message || '',
      attachments: interaction.attachments || '',
      time: interaction.time || '',
      date: interaction.date || '',
      thread: interaction.thread || '',
      summary: interaction.summary || '',
      sentiment: interaction.sentiment || 'neutral',
      sender_id: interaction.sender_id || '',
      receiver_id: interaction.receiver_id || '',
      cc_id: interaction.cc_id || ''
    });
    setEditingId(interaction.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      email_ids: '',
      email_domain: '',
      subject: '',
      message: '',
      attachments: '',
      time: '',
      date: '',
      thread: '',
      summary: '',
      sentiment: 'neutral',
      sender_id: '',
      receiver_id: '',
      cc_id: ''
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
        <div className="text-center">Loading email interactions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Interactions</h1>
          <p className="text-muted-foreground">Track and analyze email communications</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Log Interaction'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Email Interaction' : 'Log Email Interaction'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
                  <Label htmlFor="email_domain">Email Domain</Label>
                  <Input
                    id="email_domain"
                    value={formData.email_domain}
                    onChange={(e) => setFormData({ ...formData, email_domain: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender_id">Sender ID</Label>
                  <Input
                    id="sender_id"
                    value={formData.sender_id}
                    onChange={(e) => setFormData({ ...formData, sender_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver_id">Receiver ID</Label>
                  <Input
                    id="receiver_id"
                    value={formData.receiver_id}
                    onChange={(e) => setFormData({ ...formData, receiver_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc_id">CC ID</Label>
                  <Input
                    id="cc_id"
                    value={formData.cc_id}
                    onChange={(e) => setFormData({ ...formData, cc_id: e.target.value })}
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
                  <Label htmlFor="thread">Thread</Label>
                  <Input
                    id="thread"
                    value={formData.thread}
                    onChange={(e) => setFormData({ ...formData, thread: e.target.value })}
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
                  <Label htmlFor="attachments">Attachments</Label>
                  <Input
                    id="attachments"
                    placeholder="File URLs or names"
                    value={formData.attachments}
                    onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {interactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No email interactions yet</h3>
            <p className="text-muted-foreground mb-4">Start logging email interactions to track communication</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Interaction
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <Card key={interaction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      {interaction.subject}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {interaction.sender_id && `From: ${interaction.sender_id}`}
                      {interaction.receiver_id && ` → To: ${interaction.receiver_id}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(interaction.sentiment)}
                    <Badge variant="outline">{interaction.sentiment}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {interaction.message && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{interaction.message}</p>
                )}
                {interaction.summary && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium mb-1">Summary:</p>
                    <p className="text-sm text-muted-foreground">{interaction.summary}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {interaction.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(interaction.date).toLocaleDateString()}
                    </div>
                  )}
                  {interaction.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {interaction.time}
                    </div>
                  )}
                  {interaction.attachments && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="h-4 w-4" />
                      Attachments
                    </div>
                  )}
                  {interaction.thread && (
                    <Badge variant="secondary">Thread: {interaction.thread}</Badge>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(interaction)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(interaction.id)}>
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