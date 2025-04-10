const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// GET with pagination and search
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {
    title: { $regex: search, $options: 'i' },
  };

  const todos = await Todo.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({ todos });
});

// GET by ID
router.get('/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.json(todo);
});

// POST
router.post('/', async (req, res) => {
  const newTodo = new Todo({
    title: req.body.title || 'New Todo',
    description: req.body.description || '',
  });
  await newTodo.save();
  res.json(newTodo);
});

// PUT
router.put('/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

