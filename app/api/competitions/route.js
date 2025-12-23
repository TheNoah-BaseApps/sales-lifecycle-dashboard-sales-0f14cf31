import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Get all competitions
 *     description: Retrieve a list of all competitive analysis records
 *     tags: [Competitions]
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
 *     responses:
 *       200:
 *         description: List of competitions
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

    const result = await query(
      'SELECT * FROM competitions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/competitions:
 *   post:
 *     summary: Create a new competition entry
 *     description: Add a new competitive analysis record
 *     tags: [Competitions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - similar_tools
 *             properties:
 *               similar_tools:
 *                 type: string
 *               web_url:
 *                 type: string
 *               pricing:
 *                 type: string
 *               features:
 *                 type: string
 *               description:
 *                 type: string
 *               website_visits_data:
 *                 type: string
 *               social_data:
 *                 type: string
 *     responses:
 *       201:
 *         description: Competition entry created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      similar_tools, web_url, pricing, features, 
      description, website_visits_data, social_data 
    } = body;

    if (!similar_tools) {
      return NextResponse.json(
        { success: false, error: 'Similar tools name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO competitions 
       (similar_tools, web_url, pricing, features, description, website_visits_data, social_data, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
       RETURNING *`,
      [similar_tools, web_url, pricing, features, description, website_visits_data, social_data]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating competition entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}