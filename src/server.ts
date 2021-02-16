import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Backend server started on port ${port}!`);
});
