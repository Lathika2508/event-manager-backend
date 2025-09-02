import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import Event from './models/Event.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Logging HTTP requests

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { dbName: 'app' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ===== Root route for testing =====
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ===== API Routes =====

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.create({ title, description, date, location });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing event
app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;
    const updated = await Event.findByIdAndUpdate(
      id,
      { title, description, date, location },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Event.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
