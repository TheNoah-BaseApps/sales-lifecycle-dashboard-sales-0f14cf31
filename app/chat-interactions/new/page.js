'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/layout/AppBar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewChatInteractionPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    date: '',
    email_ids: '',
    name: '',
    chat_duration: '',
    conversation: '',
    summary: '',
    sentiment: '',
    action_items: '',
    purchase_intent_score: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat-interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create chat interaction');
      }

      router.push('/chat-interactions');
    } catch (err) {
      console.error('Error creating chat interaction:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <div className="mb-6">
              <Link href="/chat-interactions">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat Interactions
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add New Chat Interaction</CardTitle>
                <CardDescription>
                  Record a new chat conversation with AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Customer Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email_ids">Email</Label>
                      <Input
                        id="email_ids"
                        name="email_ids"
                        type="email"
                        value={formData.email_ids}
                        onChange={handleChange}
                        placeholder="customer@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chat_duration">Chat Duration</Label>
                      <Input
                        id="chat_duration"
                        name="chat_duration"
                        value={formData.chat_duration}
                        onChange={handleChange}
                        placeholder="e.g., 15 minutes"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sentiment">Sentiment</Label>
                      <Input
                        id="sentiment"
                        name="sentiment"
                        value={formData.sentiment}
                        onChange={handleChange}
                        placeholder="e.g., Positive, Neutral, Negative"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purchase_intent_score">Purchase Intent Score (0-100)</Label>
                      <Input
                        id="purchase_intent_score"
                        name="purchase_intent_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.purchase_intent_score}
                        onChange={handleChange}
                        placeholder="0-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversation">Conversation</Label>
                    <Textarea
                      id="conversation"
                      name="conversation"
                      value={formData.conversation}
                      onChange={handleChange}
                      placeholder="Full chat conversation transcript..."
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      placeholder="Brief summary of the chat..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="action_items">Action Items</Label>
                    <Textarea
                      id="action_items"
                      name="action_items"
                      value={formData.action_items}
                      onChange={handleChange}
                      placeholder="Follow-up actions or next steps..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Chat Interaction'}
                    </Button>
                    <Link href="/chat-interactions">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}