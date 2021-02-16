const express = require('express');
const app = express();
const connectDatabase = require('./config/connection');
const cors = require('cors');

connectDatabase();

app.use(cors());

app.use(express.json({ extended: false })); // Mitigates the need for body parser

// ROUTES
app.use('/api/users', require('./routes/users.js'))
app.use('/api/posts', require('./routes/posts.js'))

// Holds either the port given from the heroku environment or localhost:5000
let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Started server on port: ${PORT}`));
