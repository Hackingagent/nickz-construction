import express from 'express';
import { body, validationResult } from 'express-validator';
import TeamMember from '../models/TeamMember.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadTeamImage } from '../middleware/upload.js';

const router = express.Router();

// Get all active team members (public)
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ is_active: true }).sort({ sort_order: 1 });
    // Transform _id to id for frontend compatibility
    const transformedMembers = teamMembers.map(member => ({
      ...member.toObject(),
      id: member._id.toString()
    }));
    res.json(transformedMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all team members (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ sort_order: 1 });
    // Transform _id to id for frontend compatibility
    const transformedMembers = teamMembers.map(member => ({
      ...member.toObject(),
      id: member._id.toString()
    }));
    res.json(transformedMembers);
  } catch (error) {
    console.error('Get all team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create team member (admin)
router.post('/', [
  authMiddleware,
  uploadTeamImage,
  body('name').trim().notEmpty(),
  body('role').trim().notEmpty(),
  body('bio').optional().trim(),
  body('sort_order').optional().isInt()
], async (req, res) => {
  try {
    console.log('Create team member request body:', req.body);
    console.log('Create team member file:', req.file);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      role,
      bio,
      sort_order = 0
    } = req.body;

    const image_url = req.file ? `/uploads/team/${req.file.filename}` : '';

    const teamMember = new TeamMember({
      name,
      role,
      bio,
      image_url,
      sort_order
    });

    await teamMember.save();
    res.status(201).json({
      ...teamMember.toObject(),
      id: teamMember._id.toString()
    });
  } catch (error) {
    console.error('Create team member error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update team member (admin)
router.put('/:id', [
  authMiddleware,
  uploadTeamImage,
  body('name').optional().trim().notEmpty(),
  body('role').optional().trim().notEmpty(),
  body('bio').optional().trim(),
  body('sort_order').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = req.body;
    
    // Update image if new file uploaded
    if (req.file) {
      updateData.image_url = `/uploads/team/${req.file.filename}`;
    }

    const teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({
      ...teamMember.toObject(),
      id: teamMember._id.toString()
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team member (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
