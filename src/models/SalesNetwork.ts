import mongoose, { Schema, Document } from 'mongoose';

export interface ISalesNetwork extends Document {
  state: string;
  city: string;
  dealerName: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SalesNetworkSchema = new Schema<ISalesNetwork>(
  {
    state: { type: String, required: true },
    city: { type: String, required: true },
    dealerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.SalesNetwork || mongoose.model<ISalesNetwork>('SalesNetwork', SalesNetworkSchema);
