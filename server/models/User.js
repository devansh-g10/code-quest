import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
  bio: { type: String, default: '' },
  github: { type: String, default: '' },
  leetcode: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
