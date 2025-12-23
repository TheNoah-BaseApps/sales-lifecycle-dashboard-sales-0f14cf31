import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/research/{id}:
 *   get:
 *     summary: Get a single research entry by ID
 *     tags: [Research]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Research entry details
 *       404:
 *         description: Research entry not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM research WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Research entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching research entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/research/{id}:
 *   put:
 *     summary: Update a research entry
 *     tags: [Research]
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
 *         description: Research entry updated successfully
 *       404:
 *         description: Research entry not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await query(
      `UPDATE research SET
        lead_name = COALESCE($1, lead_name),
        locations = COALESCE($2, locations),
        contact_address = COALESCE($3, contact_address),
        contact_email = COALESCE($4, contact_email),
        revenue = COALESCE($5, revenue),
        ceo = COALESCE($6, ceo),
        management_team = COALESCE($7, management_team),
        public_or_private = COALESCE($8, public_or_private),
        annual_revenue = COALESCE($9, annual_revenue),
        annual_profit_loss = COALESCE($10, annual_profit_loss),
        employee_count = COALESCE($11, employee_count),
        stock_price = COALESCE($12, stock_price),
        products_or_services = COALESCE($13, products_or_services),
        website = COALESCE($14, website),
        linkedin_url = COALESCE($15, linkedin_url),
        facebook_url = COALESCE($16, facebook_url),
        twitter_handle = COALESCE($17, twitter_handle),
        youtube_url = COALESCE($18, youtube_url),
        social_posts = COALESCE($19, social_posts),
        quarterly_and_annual_documents = COALESCE($20, quarterly_and_annual_documents),
        quarterly_and_annual_summary = COALESCE($21, quarterly_and_annual_summary),
        news_textual = COALESCE($22, news_textual),
        social_insights = COALESCE($23, social_insights),
        legal = COALESCE($24, legal),
        updated_at = NOW()
      WHERE id = $25
      RETURNING *`,
      [
        body.lead_name, body.locations, body.contact_address, body.contact_email,
        body.revenue, body.ceo, body.management_team, body.public_or_private,
        body.annual_revenue, body.annual_profit_loss, body.employee_count,
        body.stock_price, body.products_or_services, body.website, body.linkedin_url,
        body.facebook_url, body.twitter_handle, body.youtube_url, body.social_posts,
        body.quarterly_and_annual_documents, body.quarterly_and_annual_summary,
        body.news_textual, body.social_insights, body.legal, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Research entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating research entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/research/{id}:
 *   delete:
 *     summary: Delete a research entry
 *     tags: [Research]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Research entry deleted successfully
 *       404:
 *         description: Research entry not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM research WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Research entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting research entry:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}