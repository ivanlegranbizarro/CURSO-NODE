import mongoose from 'mongoose';

const orderItems = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

orderItems.virtual('id').get(function () {
  return this._id.toHexString();
});

orderItems.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('OrderItem', orderItems);
