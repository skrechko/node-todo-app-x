const express = require('express');
require('dotenv').config();

const app = express();
const tasks = require('./routes/tasks');
const { connectDB } = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const routesLogger = require('./middleware/routes-logger');

// middleware
app.use(express.static('./public'));
app.use(express.json());
app.use(routesLogger);

// routes
app.use('/api/v1/tasks', tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
const host = process.env.HOST_NAME || '0.0.0.0';

connectDB(() => {
  app.listen(port, host, () =>
    console.log(
      `Server is listening on host: ${host}, port: ${port}. process.id: ${process.pid}...`
    )
  );
});
