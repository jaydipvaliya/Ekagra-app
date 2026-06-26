import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, trim: true },
    estPomodoros: { type: Number, default: 1, min: 1, max: 99 },
    completedPomodoros: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['active', 'done', 'cancelled'], default: 'active' },
    importance: { type: Boolean, default: false },
    urgency: { type: Boolean, default: false },
    date: { type: String, required: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
