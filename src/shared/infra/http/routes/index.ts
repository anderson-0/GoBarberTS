import { NextFunction, Request, Response, Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.get('/', (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;
  return res.json({ message: 'Hello' });
});

export default routes;
