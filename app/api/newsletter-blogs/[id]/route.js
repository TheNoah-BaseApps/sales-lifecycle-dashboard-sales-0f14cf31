import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/newsletter-blogs/{id}:
 *   get:
 *     summary: Get newsletter blog by ID
 *     description: Retrieve a specific newsletter blog entry by ID
 *     tags: [Newsletter Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Newsletter blog ID
 *     responses:
 *       200:
 *         description: Successfully retrieved newsletter blog
 *       404:
 *         description: Newsletter blog not found
 *       500:
 *         description: Server error
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'SELECT * FROM newsletter_blogs WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Newsletter blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching newsletter blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/newsletter-blogs/{id}:
 *   put:
 *     summary: Update newsletter blog
 *     description: Update an existing newsletter blog entry
 *     tags: [Newsletter Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Newsletter blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Newsletter blog updated successfully
 *       404:
 *         description: Newsletter blog not found
 *       500:
 *         description: Server error
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      email, 
      location, 
      time, 
      date, 
      frequency, 
      status, 
      newsletter_name, 
      blogs 
    } = body;

    const result = await query(
      `UPDATE newsletter_blogs 
       SET email = $1, location = $2, time = $3, date = $4, frequency = $5, 
           status = $6, newsletter_name = $7, blogs = $8, updated_at = NOW()
       WHERE id = $9 
       RETURNING *`,
      [email, location, time, date, frequency, status, newsletter_name, blogs, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Newsletter blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating newsletter blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/newsletter-blogs/{id}:
 *   delete:
 *     summary: Delete newsletter blog
 *     description: Delete a newsletter blog entry by ID
 *     tags: [Newsletter Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Newsletter blog ID
 *     responses:
 *       200:
 *         description: Newsletter blog deleted successfully
 *       404:
 *         description: Newsletter blog not found
 *       500:
 *         description: Server error
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await query(
      'DELETE FROM newsletter_blogs WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Newsletter blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting newsletter blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}