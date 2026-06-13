import { createApp } from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';

async function bootstrap(): Promise<void> {
  try {
    await testConnection();
    console.log('NeonDatabase connected successfully');

    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`This backend server is running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

bootstrap();