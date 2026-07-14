import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true }
  }],
  category: { type: String }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
