import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  mrp?: number;
  images: { url: string; publicId?: string }[];
  category: string;
  stock: number;
  isActive: boolean;
  keyStrengths: string[];
  ingredients: {
    category: string;
    items: string[];
  }[];
  benefits: string[];
  howToUse: string[];
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    price: { type: Number, required: true },
    mrp: Number,
    images: [{ url: { type: String, required: true }, publicId: String }],
    category: { type: String, default: 'Herbal Drops' },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    keyStrengths: [String],
    ingredients: [{
      category: String,
      items: [String]
    }],
    benefits: [String],
    howToUse: [String],
    tags: [String],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
