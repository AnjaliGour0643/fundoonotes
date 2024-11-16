import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoute from './note.route'; // Import note route

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/openapi.json'

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome to the API');
  });

  // Use the user routes for registration and login
  router.use('/users', new userRoute().getRoutes());

  // Use the note routes for creating and fetching notes
  router.use('/notes', new noteRoute().getRoutes());

  //route for swagger
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return router;
};

export default routes;
