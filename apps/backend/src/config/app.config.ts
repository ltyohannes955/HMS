import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env['PORT'] ?? '4000', 10),
    nodeEnv: process.env['NODE_ENV'] ?? 'development',
    jwtSecret: process.env['JWT_SECRET'] ?? 'dev_secret',
    jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
    frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
    databaseUrl: process.env['DATABASE_URL'],
}));
