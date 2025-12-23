'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, TrendingUp, Users, ArrowRight, Mail, Inbox, Phone, MessageSquare, Target, Star } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sales Lifecycle Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track and manage the complete sales lifecycle from initial website visits through store visits to customer signup
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Register <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Website Tracking</h3>
            <p className="text-gray-600">
              Monitor visitor behavior including IP addresses, page visits, duration, and frequency
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Store Visits</h3>
            <p className="text-gray-600">
              Track physical store visits with contact attribution and location tracking
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">
              Visualize conversion rates and track individual customer journeys
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Workflows Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Newsletter Blogs</h3>
              <p className="text-gray-600 mb-4">
                Manage newsletter campaigns and blog distribution
              </p>
              <Link href="/newsletter-blogs">
                <Button variant="outline" className="w-full">
                  View Newsletters <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Inbox className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Interactions</h3>
              <p className="text-gray-600 mb-4">
                Track and analyze email communications with sentiment analysis
              </p>
              <Link href="/email-interactions">
                <Button variant="outline" className="w-full">
                  View Emails <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Interactions</h3>
              <p className="text-gray-600 mb-4">
                Log phone calls with AI-powered insights and purchase intent scoring
              </p>
              <Link href="/call-interactions">
                <Button variant="outline" className="w-full">
                  View Calls <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Interactions</h3>
              <p className="text-gray-600 mb-4">
                Track customer chat conversations with AI analysis
              </p>
              <Link href="/chat-interactions">
                <Button variant="outline" className="w-full">
                  View Chats <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitive Analysis</h3>
              <p className="text-gray-600 mb-4">
                Monitor and analyze competitor tools and market positioning
              </p>
              <Link href="/competitions">
                <Button variant="outline" className="w-full">
                  View Competitors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Reviews</h3>
              <p className="text-gray-600 mb-4">
                Track product reviews and sentiment across channels
              </p>
              <Link href="/reviews">
                <Button variant="outline" className="w-full">
                  View Reviews <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Sales Funnel Visibility
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get real-time insights into your sales pipeline with role-based access control, 
            detailed analytics, and customer journey tracking. Perfect for sales teams, 
            marketing managers, and business analysts.
          </p>
        </div>
      </div>
    </div>
  );
}