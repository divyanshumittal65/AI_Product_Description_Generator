import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Product Description Generator Backend running on http://localhost:${PORT}`);
});
