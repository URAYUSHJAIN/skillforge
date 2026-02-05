import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, default: '' },
    coursePrice: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ['Online', 'Free'], default: 'Online' },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
    paymentIntentId: { type: String, default: null },
    sessionId: { type: String, default: null },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Failed'],
      default: 'Pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;