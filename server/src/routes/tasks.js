import { Router } from 'express';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ tasks });
});

router.post('/', async (req, res) => {
  const { text, estPomodoros = 1, importance = false, urgency = false, date } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ message: 'Task text is required' });

  const task = await Task.create({
    user: req.userId,
    text: text.trim(),
    estPomodoros,
    importance,
    urgency,
    date: date || new Date().toISOString().split('T')[0],
  });
  res.status(201).json({ task });
});

router.patch('/:id', async (req, res) => {
  const allowed = ['text', 'estPomodoros', 'completedPomodoros', 'status', 'importance', 'urgency', 'date'];
  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ task });
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ ok: true });
});

router.delete('/', async (req, res) => {
  await Task.deleteMany({ user: req.userId });
  res.json({ ok: true });
});

export default router;
