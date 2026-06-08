import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  city: string;
  review: string;
  rating: number;
  photo?: string;
  isApproved: boolean;
  isFeatured: boolean;
  productId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    photo: String,
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
