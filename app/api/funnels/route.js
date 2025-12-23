import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/funnels:
 *   get:
 *     summary: Get all funnel entries
 *     description: Retrieve all sales funnel data with pagination support
 *     tags: [Funnels]
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
 *         description: List of funnel entries
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
      'SELECT * FROM funnels ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching funnels:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/funnels:
 *   post:
 *     summary: Create a new funnel entry
 *     description: Add a new sales funnel record to the database
 *     tags: [Funnels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - stage
 *             properties:
 *               company_name:
 *                 type: string
 *               contact_name:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               stage:
 *                 type: string
 *               value:
 *                 type: string
 *               probability:
 *                 type: string
 *               expected_revenue:
 *                 type: string
 *               creation_date:
 *                 type: string
 *                 format: date-time
 *               expected_close_date:
 *                 type: string
 *                 format: date-time
 *               team_member:
 *                 type: string
 *               progress_to_won:
 *                 type: string
 *               last_interacted_on:
 *                 type: string
 *                 format: date-time
 *               next_step:
 *                 type: string
 *     responses:
 *       201:
 *         description: Funnel entry created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.company_name || !body.stage) {
      return NextResponse.json(
        { success: false, error: 'Company name and stage are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO funnels (
        company_name, contact_name, contact_email, stage, value, probability,
        expected_revenue, creation_date, expected_close_date, team_member,
        progress_to_won, last_interacted_on, next_step, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        body.company_name, body.contact_name, body.contact_email, body.stage,
        body.value, body.probability, body.expected_revenue, body.creation_date,
        body.expected_close_date, body.team_member, body.progress_to_won,
        body.last_interacted_on, body.next_step
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating funnel entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}