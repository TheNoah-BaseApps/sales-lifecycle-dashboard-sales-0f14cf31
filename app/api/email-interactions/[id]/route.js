import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/email-interactions/{id}:
 *   get:
 *     summary: Get email interaction by ID
 *     description: Retrieve a specific email interaction by ID
 *     tags: [Email Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Email interaction ID
 *     responses:
 *       200:
 *         description: Successfully retrieved email interaction
 *       404:
 *         description: Email interaction not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM email_interactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching email interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/email-interactions/{id}:
 *   put:
 *     summary: Update email interaction
 *     description: Update an existing email interaction
 *     tags: [Email Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Email interaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Email interaction updated successfully
 *       404:
 *         description: Email interaction not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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

    const result = await query(
      `UPDATE email_interactions 
       SET email_ids = $1, email_domain = $2, subject = $3, message = $4, 
           attachments = $5, time = $6, date = $7, thread = $8, summary = $9, 
           sentiment = $10, sender_id = $11, receiver_id = $12, cc_id = $13, updated_at = NOW()
       WHERE id = $14 
       RETURNING *`,
      [email_ids, email_domain, subject, message, attachments, time, date, thread, summary, sentiment, sender_id, receiver_id, cc_id, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating email interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/email-interactions/{id}:
 *   delete:
 *     summary: Delete email interaction
 *     description: Delete an email interaction by ID
 *     tags: [Email Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Email interaction ID
 *     responses:
 *       200:
 *         description: Email interaction deleted successfully
 *       404:
 *         description: Email interaction not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM email_interactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email interaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}