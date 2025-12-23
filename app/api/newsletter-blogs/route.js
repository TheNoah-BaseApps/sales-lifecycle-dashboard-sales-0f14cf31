import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/newsletter-blogs:
 *   get:
 *     summary: Get all newsletter blogs
 *     description: Retrieve a list of all newsletter blog entries with pagination and filtering
 *     tags: [Newsletter Blogs]
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Successfully retrieved newsletter blogs
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
    const status = searchParams.get('status');

    let sql = 'SELECT * FROM newsletter_blogs';
    const params = [];
    
    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
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
    console.error('Error fetching newsletter blogs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/newsletter-blogs:
 *   post:
 *     summary: Create a new newsletter blog
 *     description: Create a new newsletter blog entry
 *     tags: [Newsletter Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newsletter_name
 *             properties:
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               time:
 *                 type: string
 *               date:
 *                 type: string
 *               frequency:
 *                 type: string
 *               status:
 *                 type: string
 *               newsletter_name:
 *                 type: string
 *               blogs:
 *                 type: string
 *     responses:
 *       201:
 *         description: Newsletter blog created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      email, 
      location, 
      time, 
      date, 
      frequency, 
      status, 
      newsletter_name, 
      blogs 
    } = body;

    if (!email || !newsletter_name) {
      return NextResponse.json(
        { success: false, error: 'Email and newsletter name are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO newsletter_blogs 
       (email, location, time, date, frequency, status, newsletter_name, blogs, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
       RETURNING *`,
      [email, location, time, date, frequency, status, newsletter_name, blogs]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating newsletter blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}