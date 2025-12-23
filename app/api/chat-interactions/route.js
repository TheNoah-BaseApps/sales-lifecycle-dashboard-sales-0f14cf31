import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/chat-interactions:
 *   get:
 *     summary: Get all chat interactions
 *     description: Retrieve a list of all chat interactions with optional filtering
 *     tags: [Chat Interactions]
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
 *         description: Filter by sentiment (positive, negative, neutral)
 *     responses:
 *       200:
 *         description: List of chat interactions
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

    let sql = 'SELECT * FROM chat_interactions';
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
      data: result.rows,
      count: result.rows.length 
    });
  } catch (error) {
    console.error('Error fetching chat interactions:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/chat-interactions:
 *   post:
 *     summary: Create a new chat interaction
 *     description: Add a new chat interaction record
 *     tags: [Chat Interactions]
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
 *                 format: date-time
 *               email_ids:
 *                 type: string
 *               name:
 *                 type: string
 *               chat_duration:
 *                 type: string
 *               conversation:
 *                 type: string
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               action_items:
 *                 type: string
 *               purchase_intent_score:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Chat interaction created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      time, date, email_ids, name, chat_duration, 
      conversation, summary, sentiment, action_items, purchase_intent_score 
    } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO chat_interactions 
       (time, date, email_ids, name, chat_duration, conversation, summary, sentiment, action_items, purchase_intent_score, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
       RETURNING *`,
      [time, date, email_ids, name, chat_duration, conversation, summary, sentiment, action_items, purchase_intent_score]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating chat interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}