import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/funnels/{id}:
 *   get:
 *     summary: Get a single funnel entry by ID
 *     tags: [Funnels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funnel entry details
 *       404:
 *         description: Funnel entry not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM funnels WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Funnel entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching funnel entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/funnels/{id}:
 *   put:
 *     summary: Update a funnel entry
 *     tags: [Funnels]
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
 *         description: Funnel entry updated successfully
 *       404:
 *         description: Funnel entry not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await query(
      `UPDATE funnels SET
        company_name = COALESCE($1, company_name),
        contact_name = COALESCE($2, contact_name),
        contact_email = COALESCE($3, contact_email),
        stage = COALESCE($4, stage),
        value = COALESCE($5, value),
        probability = COALESCE($6, probability),
        expected_revenue = COALESCE($7, expected_revenue),
        creation_date = COALESCE($8, creation_date),
        expected_close_date = COALESCE($9, expected_close_date),
        team_member = COALESCE($10, team_member),
        progress_to_won = COALESCE($11, progress_to_won),
        last_interacted_on = COALESCE($12, last_interacted_on),
        next_step = COALESCE($13, next_step),
        updated_at = NOW()
      WHERE id = $14
      RETURNING *`,
      [
        body.company_name, body.contact_name, body.contact_email, body.stage,
        body.value, body.probability, body.expected_revenue, body.creation_date,
        body.expected_close_date, body.team_member, body.progress_to_won,
        body.last_interacted_on, body.next_step, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Funnel entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating funnel entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/funnels/{id}:
 *   delete:
 *     summary: Delete a funnel entry
 *     tags: [Funnels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Funnel entry deleted successfully
 *       404:
 *         description: Funnel entry not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM funnels WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Funnel entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting funnel entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}