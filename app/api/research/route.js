import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/research:
 *   get:
 *     summary: Get all research entries
 *     description: Retrieve all lead research data with pagination support
 *     tags: [Research]
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
 *         description: List of research entries
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
      'SELECT * FROM research ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/research:
 *   post:
 *     summary: Create a new research entry
 *     description: Add a new lead research record to the database
 *     tags: [Research]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lead_name
 *             properties:
 *               lead_name:
 *                 type: string
 *               locations:
 *                 type: string
 *               contact_address:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               revenue:
 *                 type: string
 *               ceo:
 *                 type: string
 *               management_team:
 *                 type: string
 *               public_or_private:
 *                 type: string
 *               annual_revenue:
 *                 type: string
 *               annual_profit_loss:
 *                 type: string
 *               employee_count:
 *                 type: integer
 *               stock_price:
 *                 type: string
 *               products_or_services:
 *                 type: string
 *               website:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               facebook_url:
 *                 type: string
 *               twitter_handle:
 *                 type: string
 *               youtube_url:
 *                 type: string
 *               social_posts:
 *                 type: string
 *               quarterly_and_annual_documents:
 *                 type: string
 *               quarterly_and_annual_summary:
 *                 type: string
 *               news_textual:
 *                 type: string
 *               social_insights:
 *                 type: string
 *               legal:
 *                 type: string
 *     responses:
 *       201:
 *         description: Research entry created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.lead_name) {
      return NextResponse.json(
        { success: false, error: 'Lead name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO research (
        lead_name, locations, contact_address, contact_email, revenue, ceo,
        management_team, public_or_private, annual_revenue, annual_profit_loss,
        employee_count, stock_price, products_or_services, website, linkedin_url,
        facebook_url, twitter_handle, youtube_url, social_posts,
        quarterly_and_annual_documents, quarterly_and_annual_summary,
        news_textual, social_insights, legal, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW(), NOW())
      RETURNING *`,
      [
        body.lead_name, body.locations, body.contact_address, body.contact_email,
        body.revenue, body.ceo, body.management_team, body.public_or_private,
        body.annual_revenue, body.annual_profit_loss, body.employee_count,
        body.stock_price, body.products_or_services, body.website, body.linkedin_url,
        body.facebook_url, body.twitter_handle, body.youtube_url, body.social_posts,
        body.quarterly_and_annual_documents, body.quarterly_and_annual_summary,
        body.news_textual, body.social_insights, body.legal
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating research:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}