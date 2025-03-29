const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config'); 
const routes = require("./routes")

const app = express();
const port = config.port; 

app.use(cors())
app.use(express.json());

mongoose.connect(config.mongodbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
