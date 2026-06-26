import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://jaydipvaliya:Doremon@cluster0.xqy3kcw.mongodb.net/name';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`[mongo] connected -> ${uri}`);
}
