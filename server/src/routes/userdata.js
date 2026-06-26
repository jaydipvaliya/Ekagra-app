import { Router } from 'express';
import UserData from '../models/UserData.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

async function getOrCreate(userId) {
  let data = await UserData.findOne({ user: userId });
  if (!data) data = await UserData.create({ user: userId });
  return data;
}

router.get('/', async (req, res) => {
  const data = await getOrCreate(req.userId);
  res.json({ data });
});

// Generic partial update — accepts any subset of: settings, goal, motivationIntention,
// ambience, activeTaskId, currentRound
router.patch('/', async (req, res) => {
  const allowed = ['settings', 'goal', 'motivationIntention', 'ambience', 'activeTaskId', 'currentRound'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const data = await UserData.findOneAndUpdate(
    { user: req.userId },
    { $set: updates },
    { new: true, upsert: true }
  );
  res.json({ data });
});

export default router;
