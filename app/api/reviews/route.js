import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve a list of all product reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: sentiment
 *         schema:
 *           type: string
 *         description: Filter by sentiment
 *       - in: query
 *         name: channel_name
 *         schema:
 *           type: string
 *         description: Filter by channel name
 *     responses:
 *       200:
 *         description: List of reviews
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
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sentiment = searchParams.get('sentiment');
    const channel_name = searchParams.get('channel_name');

    let sql = 'SELECT * FROM reviews';
    const params = [];
    const conditions = [];
    let paramCounter = 1;
    
    if (sentiment) {
      conditions.push(`sentiment = $${paramCounter++}`);
      params.push(sentiment);
    }
    
    if (channel_name) {
      conditions.push(`channel_name ILIKE $${paramCounter++}`);
      params.push(`%${channel_name}%`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ` ORDER BY created_at DESC LIMIT $${paramCounter++} OFFSET $${paramCounter}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Add a new product review record
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channel_name
 *             properties:
 *               channel_name:
 *                 type: string
 *               channel_link:
 *                 type: string
 *               reviewer_name:
 *                 type: string
 *               product_review_count:
 *                 type: integer
 *               competitive_product_review_count:
 *                 type: integer
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               pricing:
 *                 type: string
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      channel_name, channel_link, reviewer_name, product_review_count,
      competitive_product_review_count, summary, sentiment, pricing, comments
    } = body;

    if (!channel_name) {
      return NextResponse.json(
        { success: false, error: 'Channel name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO reviews 
       (channel_name, channel_link, reviewer_name, product_review_count, competitive_product_review_count, 
        summary, sentiment, pricing, comments, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
       RETURNING *`,
      [channel_name, channel_link, reviewer_name, product_review_count, competitive_product_review_count, 
       summary, sentiment, pricing, comments]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}