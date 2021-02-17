import { NextFunction, Request, Response, Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.get('/', (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  return res.json({ message: 'Hello' });
});

export default routes;
