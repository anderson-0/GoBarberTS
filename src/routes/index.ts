import { NextFunction, Request, Response, Router } from 'express';
import appointmentsRouter from './appointments.routes';
const routes = Router();

routes.use('/appointments', appointmentsRouter);

routes.get('/', (req: Request, res: Response, _next: NextFunction) => {
  return res.json({ message: 'Hello' });
});

export default routes;
