import { NextFunction, Request, Response, Router } from 'express';

const routes = Router();

routes.get('/', (req: Request, res: Response, _next: NextFunction) => {
    return res.json({ message: 'Hello' });
});

export default routes;
