const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api', orderRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
