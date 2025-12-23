/**
 * @swagger
 * /api/store-visits/{id}:
 *   put:
 *     summary: Update store visit
 *     tags: [Store Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete store visit
 *     tags: [Store Visits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */

import { NextResponse } from 'next/server';
import { requireAuth, canUpdateRecord, canDeleteRecord } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { validatePositiveInteger, validateDate, validateTime } from '@/lib/validation';

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
    const { owner_contact, number_of_visits, location, time, date } = body;

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
      `UPDATE store_visits 
       SET owner_contact = COALESCE($1, owner_contact),
           number_of_visits = COALESCE($2, number_of_visits),
           location = COALESCE($3, location),
           time = COALESCE($4, time),
           date = COALESCE($5, date),
           updated_at = NOW()
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`,
      [owner_contact, number_of_visits, location, time, date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Store visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Store visit updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/store-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update store visit' },
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
      `UPDATE store_visits 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Store visit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Store visit deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/store-visits/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete store visit' },
      { status: 500 }
    );
  }
}