import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a single campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign details
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM campaigns WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaigns]
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
 *         description: Campaign updated successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const result = await query(
      `UPDATE campaigns SET
        campaign_name = COALESCE($1, campaign_name),
        campaign_type = COALESCE($2, campaign_type),
        channel = COALESCE($3, channel),
        likes = COALESCE($4, likes),
        comments = COALESCE($5, comments),
        budget = COALESCE($6, budget),
        budget_remaining = COALESCE($7, budget_remaining),
        impressions = COALESCE($8, impressions),
        open_rate = COALESCE($9, open_rate),
        clicks = COALESCE($10, clicks),
        cta = COALESCE($11, cta),
        roi = COALESCE($12, roi),
        engagement_rate = COALESCE($13, engagement_rate),
        cart_abandonment = COALESCE($14, cart_abandonment),
        total_purchase = COALESCE($15, total_purchase),
        avg_purchase_value = COALESCE($16, avg_purchase_value),
        website_visits_count = COALESCE($17, website_visits_count),
        store_visits_count = COALESCE($18, store_visits_count),
        ecommerce_visits_count = COALESCE($19, ecommerce_visits_count),
        social_visit_counts = COALESCE($20, social_visit_counts),
        updated_at = NOW()
      WHERE id = $21
      RETURNING *`,
      [
        body.campaign_name, body.campaign_type, body.channel, body.likes,
        body.comments, body.budget, body.budget_remaining, body.impressions,
        body.open_rate, body.clicks, body.cta, body.roi, body.engagement_rate,
        body.cart_abandonment, body.total_purchase, body.avg_purchase_value,
        body.website_visits_count, body.store_visits_count, body.ecommerce_visits_count,
        body.social_visit_counts, id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted successfully
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query('DELETE FROM campaigns WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}