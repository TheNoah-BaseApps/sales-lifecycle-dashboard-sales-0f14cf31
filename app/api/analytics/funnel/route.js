/**
 * @swagger
 * /api/analytics/funnel:
 *   get:
 *     summary: Get conversion funnel analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { requireAuth, canViewAnalytics } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { calculateConversionRate } from '@/lib/utils';

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    if (!canViewAnalytics(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to view analytics' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE date BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    }

    // Get website visits count
    const websiteVisitsResult = await query(
      `SELECT COUNT(DISTINCT owner_contact) as count, COUNT(*) as total_visits
       FROM website_visits 
       ${dateFilter} AND deleted_at IS NULL`,
      params
    );

    // Get store visits count
    const storeVisitsResult = await query(
      `SELECT COUNT(DISTINCT owner_contact) as count, COUNT(*) as total_visits
       FROM store_visits 
       ${dateFilter} AND deleted_at IS NULL`,
      params
    );

    // Get signups count
    const signupsResult = await query(
      `SELECT COUNT(DISTINCT email) as count, COUNT(*) as total_signups
       FROM login_signups 
       ${dateFilter} AND deleted_at IS NULL`,
      params
    );

    const websiteVisitors = parseInt(websiteVisitsResult.rows[0].count) || 0;
    const totalWebsiteVisits = parseInt(websiteVisitsResult.rows[0].total_visits) || 0;
    const storeVisitors = parseInt(storeVisitsResult.rows[0].count) || 0;
    const totalStoreVisits = parseInt(storeVisitsResult.rows[0].total_visits) || 0;
    const signups = parseInt(signupsResult.rows[0].count) || 0;
    const totalSignups = parseInt(signupsResult.rows[0].total_signups) || 0;

    // Calculate conversion rates
    const websiteToStoreRate = calculateConversionRate(storeVisitors, websiteVisitors);
    const storeToSignupRate = calculateConversionRate(signups, storeVisitors);
    const overallConversionRate = calculateConversionRate(signups, websiteVisitors);

    return NextResponse.json(
      {
        success: true,
        data: {
          stages: [
            {
              name: 'Website Visits',
              uniqueVisitors: websiteVisitors,
              totalVisits: totalWebsiteVisits,
              conversionRate: 100,
            },
            {
              name: 'Store Visits',
              uniqueVisitors: storeVisitors,
              totalVisits: totalStoreVisits,
              conversionRate: parseFloat(websiteToStoreRate),
            },
            {
              name: 'Signups',
              uniqueVisitors: signups,
              totalVisits: totalSignups,
              conversionRate: parseFloat(storeToSignupRate),
            },
          ],
          metrics: {
            websiteToStore: parseFloat(websiteToStoreRate),
            storeToSignup: parseFloat(storeToSignupRate),
            overallConversion: parseFloat(overallConversionRate),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/analytics/funnel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch funnel analytics' },
      { status: 500 }
    );
  }
}