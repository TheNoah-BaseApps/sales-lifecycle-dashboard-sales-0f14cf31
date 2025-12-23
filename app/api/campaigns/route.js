import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     description: Retrieve all marketing campaign data with pagination support
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await query(
      'SELECT * FROM campaigns ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     description: Add a new marketing campaign record to the database
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaign_name
 *             properties:
 *               campaign_name:
 *                 type: string
 *               campaign_type:
 *                 type: string
 *               channel:
 *                 type: string
 *               likes:
 *                 type: integer
 *               comments:
 *                 type: integer
 *               budget:
 *                 type: string
 *               budget_remaining:
 *                 type: string
 *               impressions:
 *                 type: integer
 *               open_rate:
 *                 type: string
 *               clicks:
 *                 type: integer
 *               cta:
 *                 type: string
 *               roi:
 *                 type: string
 *               engagement_rate:
 *                 type: string
 *               cart_abandonment:
 *                 type: integer
 *               total_purchase:
 *                 type: string
 *               avg_purchase_value:
 *                 type: string
 *               website_visits_count:
 *                 type: integer
 *               store_visits_count:
 *                 type: integer
 *               ecommerce_visits_count:
 *                 type: integer
 *               social_visit_counts:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.campaign_name) {
      return NextResponse.json(
        { success: false, error: 'Campaign name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO campaigns (
        campaign_name, campaign_type, channel, likes, comments, budget,
        budget_remaining, impressions, open_rate, clicks, cta, roi,
        engagement_rate, cart_abandonment, total_purchase, avg_purchase_value,
        website_visits_count, store_visits_count, ecommerce_visits_count,
        social_visit_counts, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
      RETURNING *`,
      [
        body.campaign_name, body.campaign_type, body.channel, body.likes,
        body.comments, body.budget, body.budget_remaining, body.impressions,
        body.open_rate, body.clicks, body.cta, body.roi, body.engagement_rate,
        body.cart_abandonment, body.total_purchase, body.avg_purchase_value,
        body.website_visits_count, body.store_visits_count, body.ecommerce_visits_count,
        body.social_visit_counts
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}