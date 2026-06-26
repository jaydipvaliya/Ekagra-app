import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    completions: { type: Map, of: Boolean, default: {} }, // key: YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.model('Habit', habitSchema);
