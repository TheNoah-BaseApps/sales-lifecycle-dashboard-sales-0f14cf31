/**
 * @swagger
 * /api/website-visits:
 *   get:
 *     summary: Get all website visits
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: contact
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */

import { NextResponse } from 'next/server';
import { requireAuth, canCreateRecord } from '@/lib/auth';
import { query, transaction } from '@/lib/database/aurora';
import { validateIP, validatePositiveInteger, validateNonNegativeInteger, validateDate, validateTime } from '@/lib/validation';

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
    const contact = searchParams.get('contact');

    let queryText = 'SELECT * FROM website_visits WHERE deleted_at IS NULL';
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

    if (contact) {
      paramCount++;
      queryText += ` AND owner_contact ILIKE $${paramCount}`;
      params.push(`%${contact}%`);
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
    console.error('Error in GET /api/website-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website visits' },
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
    const { ip, owner_contact, number_of_visits, page_visits, website_duration, location, time, date } = body;

    // Validate IP
    const ipValidation = validateIP(ip);
    if (!ipValidation.valid) {
      return NextResponse.json(
        { success: false, error: ipValidation.error },
        { status: 400 }
      );
    }

    // Validate number of visits
    const visitsValidation = validatePositiveInteger(number_of_visits, 'Number of visits');
    if (!visitsValidation.valid) {
      return NextResponse.json(
        { success: false, error: visitsValidation.error },
        { status: 400 }
      );
    }

    // Validate website duration
    const durationValidation = validateNonNegativeInteger(website_duration, 'Website duration');
    if (!durationValidation.valid) {
      return NextResponse.json(
        { success: false, error: durationValidation.error },
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

    // Check for duplicates
    const duplicateCheck = await query(
      'SELECT id FROM website_visits WHERE ip = $1 AND date = $2 AND time = $3 AND deleted_at IS NULL',
      [ip, date, time]
    );

    if (duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A visit with this IP, date, and time already exists' },
        { status: 400 }
      );
    }

    // Create website visit and update contacts
    const result = await transaction(async (client) => {
      const visitResult = await client.query(
        `INSERT INTO website_visits 
         (ip, owner_contact, number_of_visits, page_visits, website_duration, location, time, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *`,
        [ip, owner_contact, number_of_visits, page_visits, website_duration, location, time, date]
      );

      // Update or create contact
      if (owner_contact) {
        const contactExists = await client.query(
          'SELECT id FROM contacts WHERE contact_identifier = $1',
          [owner_contact]
        );

        if (contactExists.rows.length === 0) {
          await client.query(
            `INSERT INTO contacts (contact_identifier, first_website_visit, created_at, updated_at)
             VALUES ($1, NOW(), NOW(), NOW())`,
            [owner_contact]
          );
        } else {
          await client.query(
            `UPDATE contacts 
             SET first_website_visit = COALESCE(first_website_visit, NOW()),
                 updated_at = NOW()
             WHERE contact_identifier = $1`,
            [owner_contact]
          );
        }
      }

      return visitResult.rows[0];
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: 'Website visit created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/website-visits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create website visit' },
      { status: 500 }
    );
  }
}