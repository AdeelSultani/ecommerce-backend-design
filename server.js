require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/uploads', express.static('uploads'));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Server is runing' });
});

// MongoDB Connect
const PORT = process.env.PORT ;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected!');
    app.listen(PORT, '0.0.0.0', () => {
     console.log('Server running on port 5000');
   });
  })
  .catch(err => {
    console.log(' DB Error:', err.message);
  });