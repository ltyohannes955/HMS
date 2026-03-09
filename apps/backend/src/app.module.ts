import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { PatientsModule } from './patients/patients.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    // ─── Config ───────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env', '.env.local'],
    }),

    // ─── Database ─────────────────────────────────────────────────────────────
    PrismaModule,

    // ─── Feature Modules ──────────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
