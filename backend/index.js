import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import countryRoutes from './routes/countryRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get('/', (request, response) => {
  return response.status(234).send('Welcome To WorldExplorer API');
});

// Use routes
app.use('/api', countryRoutes);
app.use('/api/users', userRoutes); // Add this line

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
