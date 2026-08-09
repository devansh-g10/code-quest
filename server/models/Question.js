import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  difficulty: { type: String, required: true },
  link: { type: String, required: true },
  tags: [String],
  isPremium: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
