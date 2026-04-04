import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  sort_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' }
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
