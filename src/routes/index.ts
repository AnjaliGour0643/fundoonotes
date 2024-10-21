import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoute from './note.route'; // Import note route

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });

  // Use the user routes for registration and login
  router.use('/users', new userRoute().getRoutes());

  // Use the note routes for creating and fetching notes
  router.use('/notes', new noteRoute().getRoutes());

  return router;
};

export default routes;
