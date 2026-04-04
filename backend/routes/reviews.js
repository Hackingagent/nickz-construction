import express from 'express';
import { body, validationResult } from 'express-validator';
import Review from '../models/Review.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ is_approved: true }).sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map(review => ({
      ...review.toObject(),
      id: review._id.toString()
    }));
    res.json(transformedReviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map(review => ({
      ...review.toObject(),
      id: review._id.toString()
    }));
    res.json(transformedReviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review (public)
router.post('/', [
  body('client_name').trim().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('review_text').trim().notEmpty(),
  body('company').optional().trim(),
  body('location').optional().trim(),
  body('image_url').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      client_name,
      company,
      rating,
      review_text,
      location,
      image_url
    } = req.body;

    const review = new Review({
      client_name,
      company,
      rating,
      review_text,
      location,
      image_url
    });

    await review.save();
    res.status(201).json({
      message: 'Review submitted successfully. It will be visible after approval.',
      review: {
        ...review.toObject(),
        id: review._id.toString()
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review (admin)
router.put('/:id', [
  authMiddleware,
  body('client_name').optional().trim().notEmpty(),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('review_text').optional().trim().notEmpty(),
  body('company').optional().trim(),
  body('location').optional().trim(),
  body('image_url').optional().isURL(),
  body('is_approved').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle review approval (admin)
router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.is_approved = !review.is_approved;
    await review.save();

    res.json({
      message: `Review ${review.is_approved ? 'approved' : 'unapproved'} successfully`,
      review
    });
  } catch (error) {
    console.error('Toggle review approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending reviews (admin)
router.get('/admin/pending', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ is_approved: false }).sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map(review => ({
      ...review.toObject(),
      id: review._id.toString()
    }));
    res.json(transformedReviews);
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get approved reviews (admin)
router.get('/admin/approved', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ is_approved: true }).sort({ created_at: -1 });
    // Transform _id to id for frontend compatibility
    const transformedReviews = reviews.map(review => ({
      ...review.toObject(),
      id: review._id.toString()
    }));
    res.json(transformedReviews);
  } catch (error) {
    console.error('Get approved reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve review (admin)
router.patch('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.is_approved = true;
    await review.save();

    res.json({
      message: 'Review approved successfully',
      review: {
        ...review.toObject(),
        id: review._id.toString()
      }
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject review (admin)
router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.is_approved = false;
    await review.save();

    res.json({
      message: 'Review rejected successfully',
      review: {
        ...review.toObject(),
        id: review._id.toString()
      }
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
