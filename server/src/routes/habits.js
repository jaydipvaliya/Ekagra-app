import { Router } from 'express';
import Habit from '../models/Habit.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function serialize(habit) {
  return {
    id: habit._id,
    name: habit.name,
    completions: Object.fromEntries(habit.completions || []),
    createdAt: habit.createdAt,
  };
}

router.get('/', async (req, res) => {
  const habits = await Habit.find({ user: req.userId }).sort({ createdAt: 1 });
  res.json({ habits: habits.map(serialize) });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: 'Habit name is required' });
  const habit = await Habit.create({ user: req.userId, name: name.trim() });
  res.status(201).json({ habit: serialize(habit) });
});

router.patch('/:id/toggle', async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ message: 'Date is required' });

  const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });

  if (habit.completions.get(date)) {
    habit.completions.delete(date);
  } else {
    habit.completions.set(date, true);
  }
  await habit.save();
  res.json({ habit: serialize(habit) });
});

router.delete('/:id', async (req, res) => {
  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!habit) return res.status(404).json({ message: 'Habit not found' });
  res.json({ ok: true });
});

export default router;
