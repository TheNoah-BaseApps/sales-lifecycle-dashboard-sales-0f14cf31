/**
 * @swagger
 * /api/analytics/trends:
 *   get:
 *     summary: Get trend analytics
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
    const granularity = searchParams.get('granularity') || 'daily';

    let dateFilter = '';
    const params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE date BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    }

    // Get website visits trends
    const websiteVisitsTrend = await query(
      `SELECT date, COUNT(*) as count
       FROM website_visits
       ${dateFilter} AND deleted_at IS NULL
       GROUP BY date
       ORDER BY date ASC`,
      params
    );

    // Get store visits trends
    const storeVisitsTrend = await query(
      `SELECT date, COUNT(*) as count
       FROM store_visits
       ${dateFilter} AND deleted_at IS NULL
       GROUP BY date
       ORDER BY date ASC`,
      params
    );

    // Get signups trends
    const signupsTrend = await query(
      `SELECT date, COUNT(*) as count
       FROM login_signups
       ${dateFilter} AND deleted_at IS NULL
       GROUP BY date
       ORDER BY date ASC`,
      params
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          websiteVisits: websiteVisitsTrend.rows.map(row => ({
            date: row.date,
            count: parseInt(row.count),
          })),
          storeVisits: storeVisitsTrend.rows.map(row => ({
            date: row.date,
            count: parseInt(row.count),
          })),
          signups: signupsTrend.rows.map(row => ({
            date: row.date,
            count: parseInt(row.count),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/analytics/trends:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trend analytics' },
      { status: 500 }
    );
  }
}