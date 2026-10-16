const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./util/database');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running successfully on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Database connection error:', err);
  });