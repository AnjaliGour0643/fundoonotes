import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });

  // Use the user routes for registration and login
  router.use('/users', new userRoute().getRoutes());

  return router;
};

export default routes;
