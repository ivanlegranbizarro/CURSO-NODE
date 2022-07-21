import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
  zip: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});
export default mongoose.model('User', userSchema);
