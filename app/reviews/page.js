'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Search, TrendingUp, MessageCircle, DollarSign } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    totalProductReviews: 0,
    totalCompetitiveReviews: 0
  });

  useEffect(() => {
    fetchReviews();
  }, [sentimentFilter]);

  async function fetchReviews() {
    try {
      setLoading(true);
      const url = sentimentFilter !== 'all' 
        ? `/api/reviews?sentiment=${sentimentFilter}`
        : '/api/reviews';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setReviews(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data) {
    const total = data.length;
    const positive = data.filter(r => r.sentiment === 'positive').length;
    const neutral = data.filter(r => r.sentiment === 'neutral').length;
    const negative = data.filter(r => r.sentiment === 'negative').length;
    const totalProductReviews = data.reduce((acc, r) => acc + (r.product_review_count || 0), 0);
    const totalCompetitiveReviews = data.reduce((acc, r) => acc + (r.competitive_product_review_count || 0), 0);
    
    setStats({ total, positive, neutral, negative, totalProductReviews, totalCompetitiveReviews });
  }

  const filteredReviews = reviews.filter(review =>
    review.channel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Reviews</h1>
          <p className="text-muted-foreground">Track and analyze product reviews across channels</p>
        </div>
        <Button asChild>
          <Link href="/reviews/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Reviews</CardTitle>
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
            <CardTitle className="text-sm font-medium">Our Product</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductReviews}</div>
            <p className="text-xs text-muted-foreground">Review mentions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competitor Products</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompetitiveReviews}</div>
            <p className="text-xs text-muted-foreground">Review mentions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by channel or reviewer name..."
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

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Product Reviews</CardTitle>
          <CardDescription>
            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No reviews found</h3>
              <p className="text-muted-foreground">Get started by adding product review data.</p>
              <Button asChild className="mt-4">
                <Link href="/reviews/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Review
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{review.channel_name}</h3>
                          <Badge className={getSentimentColor(review.sentiment)}>
                            {review.sentiment || 'N/A'}
                          </Badge>
                          {review.pricing && (
                            <Badge variant="outline">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {review.pricing}
                            </Badge>
                          )}
                        </div>
                        {review.reviewer_name && (
                          <p className="text-sm text-muted-foreground">By {review.reviewer_name}</p>
                        )}
                        {review.channel_link && (
                          <a 
                            href={review.channel_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Channel →
                          </a>
                        )}
                        <p className="text-sm">{review.summary || 'No summary available'}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {review.product_review_count !== null && (
                            <span>Our Product: {review.product_review_count} reviews</span>
                          )}
                          {review.competitive_product_review_count !== null && (
                            <span>Competitors: {review.competitive_product_review_count} reviews</span>
                          )}
                        </div>
                        {review.comments && (
                          <p className="text-sm italic text-muted-foreground">"{review.comments}"</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/reviews/${review.id}`}>View Details</Link>
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
  );
}