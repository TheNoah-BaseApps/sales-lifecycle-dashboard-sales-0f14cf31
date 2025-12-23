/**
 * @swagger
 * /api/contacts/journey/{identifier}:
 *   get:
 *     summary: Get customer journey by contact identifier
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { query } from '@/lib/database/aurora';

export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    const { identifier } = params;

    // Get contact info
    const contactResult = await query(
      'SELECT * FROM contacts WHERE contact_identifier = $1',
      [identifier]
    );

    if (contactResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    const contact = contactResult.rows[0];

    // Get website visits
    const websiteVisits = await query(
      `SELECT * FROM website_visits 
       WHERE owner_contact = $1 AND deleted_at IS NULL
       ORDER BY date ASC, time ASC`,
      [identifier]
    );

    // Get store visits
    const storeVisits = await query(
      `SELECT * FROM store_visits 
       WHERE owner_contact = $1 AND deleted_at IS NULL
       ORDER BY date ASC, time ASC`,
      [identifier]
    );

    // Get signups
    const signups = await query(
      `SELECT * FROM login_signups 
       WHERE email = $1 AND deleted_at IS NULL
       ORDER BY date ASC, time ASC`,
      [identifier]
    );

    // Combine and sort all events
    const events = [
      ...websiteVisits.rows.map(v => ({
        type: 'website_visit',
        date: v.date,
        time: v.time,
        data: v,
      })),
      ...storeVisits.rows.map(v => ({
        type: 'store_visit',
        date: v.date,
        time: v.time,
        data: v,
      })),
      ...signups.rows.map(s => ({
        type: 'signup',
        date: s.date,
        time: s.time,
        data: s,
      })),
    ].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA - dateB;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          contact,
          events,
          summary: {
            totalWebsiteVisits: websiteVisits.rows.length,
            totalStoreVisits: storeVisits.rows.length,
            totalSignups: signups.rows.length,
            firstInteraction: events.length > 0 ? events[0].date : null,
            lastInteraction: events.length > 0 ? events[events.length - 1].date : null,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/contacts/journey/[identifier]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer journey' },
      { status: 500 }
    );
  }
}