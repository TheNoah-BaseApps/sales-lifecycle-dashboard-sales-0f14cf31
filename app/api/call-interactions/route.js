import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/call-interactions:
 *   get:
 *     summary: Get all call interactions
 *     description: Retrieve a list of all call interactions with pagination and filtering
 *     tags: [Call Interactions]
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
 *       - in: query
 *         name: sentiment
 *         schema:
 *           type: string
 *         description: Filter by sentiment
 *     responses:
 *       200:
 *         description: Successfully retrieved call interactions
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
    const sentiment = searchParams.get('sentiment');

    let sql = 'SELECT * FROM call_interactions';
    const params = [];
    
    if (sentiment) {
      sql += ' WHERE sentiment = $1';
      params.push(sentiment);
      sql += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      sql += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await query(sql, params);
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('Error fetching call interactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/call-interactions:
 *   post:
 *     summary: Create a new call interaction
 *     description: Create a new call interaction entry with AI analysis
 *     tags: [Call Interactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *               email_ids:
 *                 type: string
 *               name:
 *                 type: string
 *               call_duration:
 *                 type: string
 *               voice_recordings:
 *                 type: string
 *               transcripts:
 *                 type: string
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               action_items:
 *                 type: string
 *               purchase_intent_score:
 *                 type: integer
 *               sales_highlights:
 *                 type: string
 *     responses:
 *       201:
 *         description: Call interaction created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      time, 
      date, 
      email_ids, 
      name, 
      call_duration, 
      voice_recordings, 
      transcripts, 
      summary, 
      sentiment, 
      action_items, 
      purchase_intent_score, 
      sales_highlights 
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO call_interactions 
       (time, date, email_ids, name, call_duration, voice_recordings, transcripts, summary, sentiment, action_items, purchase_intent_score, sales_highlights, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) 
       RETURNING *`,
      [time, date, email_ids, name, call_duration, voice_recordings, transcripts, summary, sentiment, action_items, purchase_intent_score, sales_highlights]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating call interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}