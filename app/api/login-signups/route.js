/**
 * @swagger
 * /api/login-signups:
 *   get:
 *     summary: Get all login signups
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create login signup
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */

import { NextResponse } from 'next/server';
import { requireAuth, canCreateRecord } from '@/lib/auth';
import { query, transaction } from '@/lib/database/aurora';
import { validateEmail, validateDate, validateTime } from '@/lib/validation';

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const location = searchParams.get('location');
    const email = searchParams.get('email');

    let queryText = 'SELECT * FROM login_signups WHERE deleted_at IS NULL';
    const params = [];
    let paramCount = 0;

    if (startDate) {
      paramCount++;
      queryText += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      queryText += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    if (location) {
      paramCount++;
      queryText += ` AND location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
    }

    if (email) {
      paramCount++;
      queryText += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
    }

    queryText += ' ORDER BY date DESC, time DESC';

    const result = await query(queryText, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/login-signups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch login signups' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    if (!canCreateRecord(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to create records' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, email, location, time, date } = body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { success: false, error: emailValidation.error },
        { status: 400 }
      );
    }

    // Validate date
    const dateValidation = validateDate(date, 'Date');
    if (!dateValidation.valid) {
      return NextResponse.json(
        { success: false, error: dateValidation.error },
        { status: 400 }
      );
    }

    // Validate time
    const timeValidation = validateTime(time, 'Time');
    if (!timeValidation.valid) {
      return NextResponse.json(
        { success: false, error: timeValidation.error },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!username || !location) {
      return NextResponse.json(
        { success: false, error: 'Username and location are required' },
        { status: 400 }
      );
    }

    // Create login signup and update contacts
    const result = await transaction(async (client) => {
      const signupResult = await client.query(
        `INSERT INTO login_signups 
         (username, email, location, time, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [username, email, location, time, date]
      );

      // Update or create contact
      const contactExists = await client.query(
        'SELECT id FROM contacts WHERE contact_identifier = $1',
        [email]
      );

      if (contactExists.rows.length === 0) {
        await client.query(
          `INSERT INTO contacts (contact_identifier, signup_date, created_at, updated_at)
           VALUES ($1, NOW(), NOW(), NOW())`,
          [email]
        );
      } else {
        await client.query(
          `UPDATE contacts 
           SET signup_date = COALESCE(signup_date, NOW()),
               updated_at = NOW()
           WHERE contact_identifier = $1`,
          [email]
        );
      }

      return signupResult.rows[0];
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: 'Login signup created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/login-signups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create login signup' },
      { status: 500 }
    );
  }
}