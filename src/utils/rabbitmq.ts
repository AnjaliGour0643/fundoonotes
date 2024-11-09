import amqp from 'amqplib';
const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const createChannel = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Error creating RabbitMQ channel:', error);
    throw error;
  }
};