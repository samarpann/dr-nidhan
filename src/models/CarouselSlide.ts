import mongoose, { Schema, Document } from 'mongoose';

export interface ICarouselSlide extends Document {
  imageUrl: string;
  caption?: string;
  ctaText?: string;
  ctaLink?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarouselSlideSchema = new Schema<ICarouselSlide>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    ctaText: { type: String, default: 'Shop Now' },
    ctaLink: { type: String, default: '/products' },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.CarouselSlide || mongoose.model<ICarouselSlide>('CarouselSlide', CarouselSlideSchema);
