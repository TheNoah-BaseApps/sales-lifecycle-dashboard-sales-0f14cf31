/**
 * @swagger
 * /api/login-signups/{id}:
 *   put:
 *     summary: Update login signup
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete login signup
 *     tags: [Login Signups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */

import { NextResponse } from 'next/server';
import { requireAuth, canUpdateRecord, canDeleteRecord } from '@/lib/auth';
import { query } from '@/lib/database/aurora';
import { validateEmail, validateDate, validateTime } from '@/lib/validation';

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
    const { username, email, location, time, date } = body;

    // Validate email
    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return NextResponse.json(
          { success: false, error: emailValidation.error },
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
      `UPDATE login_signups 
       SET username = COALESCE($1, username),
           email = COALESCE($2, email),
           location = COALESCE($3, location),
           time = COALESCE($4, time),
           date = COALESCE($5, date),
           updated_at = NOW()
       WHERE id = $6 AND deleted_at IS NULL
       RETURNING *`,
      [username, email, location, time, date, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Login signup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Login signup updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT /api/login-signups/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update login signup' },
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
      `UPDATE login_signups 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Login signup not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login signup deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/login-signups/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete login signup' },
      { status: 500 }
    );
  }
}