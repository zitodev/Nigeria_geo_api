require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


// Routes
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/geo', require('./routes/stateLgaCommunityRoute'));


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
});


