import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    focusDuration: { type: Number, default: 25 },
    shortBreakDuration: { type: Number, default: 5 },
    longBreakDuration: { type: Number, default: 15 },
    deepWorkDuration: { type: Number, default: 45 },
    roundsBeforeLongBreak: { type: Number, default: 4 },
    autoStartNextSession: { type: Boolean, default: false },
    soundEnabled: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { _id: false }
);

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    targetDate: { type: String, default: '' },
  },
  { _id: false }
);

const ambienceItemSchema = new mongoose.Schema(
  {
    id: String,
    isPlaying: Boolean,
    volume: Number,
  },
  { _id: false }
);

const userDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    activeTaskId: { type: mongoose.Schema.Types.ObjectId, default: null },
    currentRound: { type: Number, default: 1 },
    motivationIntention: { type: String, default: '' },
    settings: { type: settingsSchema, default: () => ({}) },
    goal: { type: goalSchema, default: null },
    ambience: { type: [ambienceItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('UserData', userDataSchema);
