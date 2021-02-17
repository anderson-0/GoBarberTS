import { NextFunction, Request, Response, Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);

routes.get('/', (req: Request, res: Response, _next: NextFunction) => {
  return res.json({ message: 'Hello' });
});

export default routes;
