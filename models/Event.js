
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    location: { type: String, default: '' }
  },
  { timestamps: true, collection: 'events' }
);

export default mongoose.model('Event', EventSchema);
