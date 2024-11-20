import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import Logger from '../config/logger';
import HttpStatus from 'http-status-codes';

const logger = Logger.logger;

export const cacheNotesByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.createdBy;

  try {
    const cachedNotes = await redisClient.get(`notes:${userId}`);
    if (cachedNotes) {
      logger.info('Fetching notes from Redis cache');
      return res.status(HttpStatus.CREATED).json({ 
        message: 'Data retrieved from Redis cache', 
        notes : await JSON.parse(cachedNotes)
      });
    }
    next();
  } catch (error) {
    logger.error(`Error in Redis middleware: ${error}`);
    next(error);
  }
};

export default cacheNotesByUserId;
