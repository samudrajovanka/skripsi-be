const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const routes = require('./routes');
const databaseConnetion = require('./utils/database/connection');
const NotFoundError = require('./exceptions/NotFoundError');
const { errorRes } = require('./utils/errorResponse');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

app.get('/', (req, res) => {
  return res.json({ message: 'Welcome to the application.' });
});
routes.forEach((route) => {
  app.use(route.url, route.api);
});

// not found routes
app.use((_, res) => {
  return errorRes(res, new NotFoundError())
});

databaseConnetion.on('open', () => {
  console.log('Database connected');

  // run server
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server run on port ${port}`);
  });
});

databaseConnetion.on('error', () => console.log('Database not connected'));