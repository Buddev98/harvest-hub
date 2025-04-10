import mongoose, { Document, Schema } from 'mongoose';
 
 
interface IProduct extends Document {
    farmerId:mongoose.Schema.Types.ObjectId;
    name: string;
    imageUrl: string;
    quantity: number;
    pricePerKg: number;
    category: string;
    createdAt: Date;
    }
   
 
const productSchema: Schema<IProduct> = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  imageUrl: { type: String },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
 
 
const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;