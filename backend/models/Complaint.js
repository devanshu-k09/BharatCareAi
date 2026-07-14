import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  details: { type: String, required: true },
  generatedDraft: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
