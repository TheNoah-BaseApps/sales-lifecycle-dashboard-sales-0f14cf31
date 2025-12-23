/**
 * @swagger
 * /api/website-visits/{id}:
 *   put:
 *     summary: Update website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete website visit
 *     tags: [Website Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */

import { NextResponse } from 'next/server';
import { requireAuth, canUpdateRecord, canDeleteRecord } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { validateIP, validatePositiveInteger, validateNonNegativeInteger, validateDate, validateTime } from '@/lib/validation';

export async function PUT(request, { params }) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    if (!canUpdateRecord(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to update records' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { ip, owner_contact, number_of_visits, page_visits, website_duration, location, time, date } = body;

    // Validate IP
    if (ip) {
      const ipValidation = validateIP(ip);
      if (!ipValidation.valid) {
        return NextResponse.json(
          { success: false, error: ipValidation.error },
          { status: 400 }
        );
      }
    }

    // Validate number of visits
    if (number_of_visits !== undefined) {
      const visitsValidation = validatePositiveInteger(number_of_visits, 'Number of visits');
      if (!visitsValidation.valid) {
        return NextResponse.json(
          { success: false, error: visitsValidation.error },
          { status: 400 }
        );
      }
    }

    // Validate website duration
    if (website_duration !== undefined) {
      const durationValidation = validateNonNegativeInteger(website_duration, 'Website duration');
      if (!durationValidation.valid) {
        return NextResponse.json(
          { success: false, error: durationValidation.error },
          { status: 400 }
        );
      }
    }

    // Validate date
    if (date) {
      const dateValidation = validateDate(date, 'Date');
      if (!dateValidation.valid) {
        return NextResponse.json(
          { success: false, error: dateValidation.error },
          { status: 400 }
        );
      }
    }

    // Validate time
    if (time) {
      const timeValidation = validateTime(time, 'Time');
      if (!timeValidation.valid) {
        return NextResponse.json(
          { success: false, error: timeValidation.error },
          { status: 400 }
        );
      }
    }

    const result = await query(
      `UPDATE website_visits 
       SET ip = COALESCE($1, ip),
           owner_contact = COALESCE($2, owner_contact),
           number_of_visits = COALESCE($3, number_of_visits),
           page_visits = COALESCE($4, page_visits),
           website_duration = COALESCE($5, website_duration),
           location = COALESCE($6, location),
           time = COALESCE($7, time),
           date = COALESCE($8, date),
           updated_at = NOW()
       WHERE id = $9 AND deleted_at IS NULL
       RETURNING *`,
      [ip, owner_contact, number_of_visits, page_visits, website_duration, location, time, date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Website visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Website visit updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/website-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update website visit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request);
    
    if (!auth.authorized) {
      return auth.response;
    }

    if (!canDeleteRecord(auth.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to delete records' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Soft delete
    const result = await query(
      `UPDATE website_visits 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Website visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Website visit deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/website-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete website visit' },
      { status: 500 }
    );
  }
}