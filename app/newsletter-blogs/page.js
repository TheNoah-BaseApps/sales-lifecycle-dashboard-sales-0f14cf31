'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Mail, MapPin, Calendar, Clock } from 'lucide-react';

export default function NewsletterBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    location: '',
    time: '',
    date: '',
    frequency: '',
    status: 'draft',
    newsletter_name: '',
    blogs: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      const res = await fetch('/api/newsletter-blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/newsletter-blogs/${editingId}` 
        : '/api/newsletter-blogs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this newsletter blog?')) return;
    
    try {
      const res = await fetch(`/api/newsletter-blogs/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  }

  function handleEdit(blog) {
    setFormData({
      email: blog.email || '',
      location: blog.location || '',
      time: blog.time || '',
      date: blog.date || '',
      frequency: blog.frequency || '',
      status: blog.status || 'draft',
      newsletter_name: blog.newsletter_name || '',
      blogs: blog.blogs || ''
    });
    setEditingId(blog.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      email: '',
      location: '',
      time: '',
      date: '',
      frequency: '',
      status: 'draft',
      newsletter_name: '',
      blogs: ''
    });
    setEditingId(null);
    setShowForm(false);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading newsletter blogs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Blogs</h1>
          <p className="text-muted-foreground">Manage your newsletter and blog distribution</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'Create Newsletter'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Newsletter Blog' : 'Create Newsletter Blog'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newsletter_name">Newsletter Name *</Label>
                  <Input
                    id="newsletter_name"
                    value={formData.newsletter_name}
                    onChange={(e) => setFormData({ ...formData, newsletter_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Weekly, Monthly"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogs">Blog Content</Label>
                <Textarea
                  id="blogs"
                  rows={6}
                  value={formData.blogs}
                  onChange={(e) => setFormData({ ...formData, blogs: e.target.value })}
                  placeholder="Enter blog content or links..."
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

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No newsletter blogs yet</h3>
            <p className="text-muted-foreground mb-4">Create your first newsletter to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Newsletter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{blog.newsletter_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {blog.email}
                    </CardDescription>
                  </div>
                  <Badge variant={blog.status === 'sent' ? 'default' : 'secondary'}>
                    {blog.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {blog.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {blog.location}
                  </div>
                )}
                {blog.date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                )}
                {blog.time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {blog.time}
                  </div>
                )}
                {blog.frequency && (
                  <div className="text-sm">
                    <span className="font-medium">Frequency:</span> {blog.frequency}
                  </div>
                )}
                {blog.blogs && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{blog.blogs}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
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