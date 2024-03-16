const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World! Welcome to the Bird Calls Learning App.');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

mongoose.connect('mongodb://localhost:27017/myDB')
  .then(() => console.log('MongoDB connected…'))
  .catch(err => console.log(err));
