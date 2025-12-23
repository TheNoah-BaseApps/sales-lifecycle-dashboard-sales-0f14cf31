import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/chat-interactions/{id}:
 *   get:
 *     summary: Get a chat interaction by ID
 *     tags: [Chat Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat interaction details
 *       404:
 *         description: Chat interaction not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM chat_interactions WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Chat interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching chat interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/chat-interactions/{id}:
 *   put:
 *     summary: Update a chat interaction
 *     tags: [Chat Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Chat interaction updated
 *       404:
 *         description: Chat interaction not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      time, date, email_ids, name, chat_duration, 
      conversation, summary, sentiment, action_items, purchase_intent_score 
    } = body;

    const result = await query(
      `UPDATE chat_interactions 
       SET time = $1, date = $2, email_ids = $3, name = $4, chat_duration = $5, 
           conversation = $6, summary = $7, sentiment = $8, action_items = $9, 
           purchase_intent_score = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [time, date, email_ids, name, chat_duration, conversation, summary, sentiment, action_items, purchase_intent_score, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Chat interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating chat interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/chat-interactions/{id}:
 *   delete:
 *     summary: Delete a chat interaction
 *     tags: [Chat Interactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat interaction deleted
 *       404:
 *         description: Chat interaction not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM chat_interactions WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Chat interaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting chat interaction:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}