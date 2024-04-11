const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const birdCallRoutes = require('./routes/birdCallRoutes');
const userLevelRoutes = require('./routes/userLevelRoutes');
const itemLevelRoutes = require('./routes/itemLevelRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const authRoutes = require('./routes/authRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

// Import other routes as needed

const app = express();

mongoose.connect('mongodb://localhost:27017/myDB')
  .then(() => console.log('MongoDB connected…'))
  .catch(err => console.log(err));

app.use(express.json()); // for parsing application/json

app.get('/', function (req, res) {
    res.send('hello index');
  });

app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', birdCallRoutes);
app.use('/api', userLevelRoutes);
app.use('/api', itemLevelRoutes);
app.use('/api', lessonRoutes);
app.use('/api', authRoutes);
app.use('/api', classroomRoutes);
app.use('/api', sessionRoutes);
// Use other routes as needed

const PORT = process.env.PORT || 3001;
app.set('port', PORT);
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
