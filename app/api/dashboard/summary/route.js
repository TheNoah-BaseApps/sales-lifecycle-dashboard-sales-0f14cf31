/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { calculateConversionRate } from '@/lib/utils';

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    // Get total website visits
    const websiteVisitsResult = await query(
      `SELECT COUNT(*) as total, COUNT(DISTINCT owner_contact) as unique_visitors
       FROM website_visits WHERE deleted_at IS NULL`
    );

    // Get total store visits
    const storeVisitsResult = await query(
      `SELECT COUNT(*) as total, COUNT(DISTINCT owner_contact) as unique_visitors
       FROM store_visits WHERE deleted_at IS NULL`
    );

    // Get total signups
    const signupsResult = await query(
      `SELECT COUNT(*) as total, COUNT(DISTINCT email) as unique_signups
       FROM login_signups WHERE deleted_at IS NULL`
    );

    // Get recent activities
    const recentActivities = await query(
      `(SELECT 'website_visit' as type, ip as identifier, location, date, time, created_at
        FROM website_visits WHERE deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 5)
       UNION ALL
       (SELECT 'store_visit' as type, owner_contact as identifier, location, date, time, created_at
        FROM store_visits WHERE deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 5)
       UNION ALL
       (SELECT 'signup' as type, email as identifier, location, date, time, created_at
        FROM login_signups WHERE deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 5)
       ORDER BY created_at DESC
       LIMIT 10`
    );

    const totalWebsiteVisits = parseInt(websiteVisitsResult.rows[0].total) || 0;
    const uniqueWebsiteVisitors = parseInt(websiteVisitsResult.rows[0].unique_visitors) || 0;
    const totalStoreVisits = parseInt(storeVisitsResult.rows[0].total) || 0;
    const uniqueStoreVisitors = parseInt(storeVisitsResult.rows[0].unique_visitors) || 0;
    const totalSignups = parseInt(signupsResult.rows[0].total) || 0;
    const uniqueSignups = parseInt(signupsResult.rows[0].unique_signups) || 0;

    // Calculate conversion rates
    const websiteToStoreRate = calculateConversionRate(uniqueStoreVisitors, uniqueWebsiteVisitors);
    const storeToSignupRate = calculateConversionRate(uniqueSignups, uniqueStoreVisitors);

    return NextResponse.json(
      {
        success: true,
        data: {
          metrics: {
            totalWebsiteVisits,
            uniqueWebsiteVisitors,
            totalStoreVisits,
            uniqueStoreVisitors,
            totalSignups,
            uniqueSignups,
            websiteToStoreConversion: parseFloat(websiteToStoreRate),
            storeToSignupConversion: parseFloat(storeToSignupRate),
          },
          recentActivities: recentActivities.rows,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/dashboard/summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}