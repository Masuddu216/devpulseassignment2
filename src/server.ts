import { createApp } from './app.js';
import { env } from './config/env.js';
import { testConnection } from './config/db.js';

async function bootstrap(): Promise<void> {
  try {
    await testConnection();
    console.log('Database connection established');

    const app = createApp();

    app.listen(env.PORT, () => {
      console.log(`DevPulse API running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();