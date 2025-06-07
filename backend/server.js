const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/payments', paymentRoutes);
app.get('/api', (req, res) => res.json({ message: 'CollabKart API' }));

app.listen(5000, () => console.log('Server on port 5000'));