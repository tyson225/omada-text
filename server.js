const express = require('express');
const connectDatabase = require('./config/connection');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json({ extended: false })); // Mitigates the need for body parser

connectDatabase();

app.get('./', (req, res) => res.send('App is working!'));

// Holds either the port given from the heroku environment or localhost:5000
let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Started server on port: ${PORT}`));
