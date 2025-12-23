import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/call-interactions/{id}:
 *   get:
 *     summary: Get call interaction by ID
 *     description: Retrieve a specific call interaction by ID
 *     tags: [Call Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Call interaction ID
 *     responses:
 *       200:
 *         description: Successfully retrieved call interaction
 *       404:
 *         description: Call interaction not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM call_interactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Call interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching call interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/call-interactions/{id}:
 *   put:
 *     summary: Update call interaction
 *     description: Update an existing call interaction
 *     tags: [Call Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Call interaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Call interaction updated successfully
 *       404:
 *         description: Call interaction not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      time, 
      date, 
      email_ids, 
      name, 
      call_duration, 
      voice_recordings, 
      transcripts, 
      summary, 
      sentiment, 
      action_items, 
      purchase_intent_score, 
      sales_highlights 
    } = body;

    const result = await query(
      `UPDATE call_interactions 
       SET time = $1, date = $2, email_ids = $3, name = $4, call_duration = $5, 
           voice_recordings = $6, transcripts = $7, summary = $8, sentiment = $9, 
           action_items = $10, purchase_intent_score = $11, sales_highlights = $12, updated_at = NOW()
       WHERE id = $13 
       RETURNING *`,
      [time, date, email_ids, name, call_duration, voice_recordings, transcripts, summary, sentiment, action_items, purchase_intent_score, sales_highlights, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Call interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating call interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/call-interactions/{id}:
 *   delete:
 *     summary: Delete call interaction
 *     description: Delete a call interaction by ID
 *     tags: [Call Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Call interaction ID
 *     responses:
 *       200:
 *         description: Call interaction deleted successfully
 *       404:
 *         description: Call interaction not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM call_interactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Call interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Call interaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting call interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}