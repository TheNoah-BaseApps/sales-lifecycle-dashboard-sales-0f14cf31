import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/email-interactions:
 *   get:
 *     summary: Get all email interactions
 *     description: Retrieve a list of all email interactions with pagination and filtering
 *     tags: [Email Interactions]
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
 *         description: Successfully retrieved email interactions
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

    let sql = 'SELECT * FROM email_interactions';
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
    console.error('Error fetching email interactions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/email-interactions:
 *   post:
 *     summary: Create a new email interaction
 *     description: Create a new email interaction entry
 *     tags: [Email Interactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *             properties:
 *               email_ids:
 *                 type: string
 *               email_domain:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               attachments:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *               thread:
 *                 type: string
 *               summary:
 *                 type: string
 *               sentiment:
 *                 type: string
 *               sender_id:
 *                 type: string
 *               receiver_id:
 *                 type: string
 *               cc_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email interaction created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      email_ids, 
      email_domain, 
      subject, 
      message, 
      attachments, 
      time, 
      date, 
      thread, 
      summary, 
      sentiment, 
      sender_id, 
      receiver_id, 
      cc_id 
    } = body;

    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO email_interactions 
       (email_ids, email_domain, subject, message, attachments, time, date, thread, summary, sentiment, sender_id, receiver_id, cc_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) 
       RETURNING *`,
      [email_ids, email_domain, subject, message, attachments, time, date, thread, summary, sentiment, sender_id, receiver_id, cc_id]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}