import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';

const app = express();

app.use(routes);

console.log(process.env.PORT);

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Backend server started on port ${port}!`);
});
