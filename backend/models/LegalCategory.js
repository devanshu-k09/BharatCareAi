import mongoose from 'mongoose';

const legalCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  commonIssues: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('LegalCategory', legalCategorySchema);
