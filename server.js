const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.error(`UNCAUGHT EXCEPTION, SHUTTING DOWN`);
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, '127.0.0.1', () =>
  console.log(`server has been ran on port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.error(`UNHANDLED REJECTION, SHUTTING DOWN`);
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
