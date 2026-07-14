import mongoose from 'mongoose';

const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String },
  contactNumber: { type: String },
  officeType: { type: String }
}, { timestamps: true });

export default mongoose.model('Authority', authoritySchema);
