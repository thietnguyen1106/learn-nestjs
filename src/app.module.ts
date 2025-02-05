import { existsSync } from 'fs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { databaseConfig } from 'src/config/database';
import { UsersModule } from 'src/modules/users/users.module';
import { RolesModule } from 'src/modules/roles/roles.module';
import { PermissionsModule } from 'src/modules/permissions/permissions.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MoviesModule } from 'src/modules/movies/movies.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const env = process.env.NODE_ENV || 'development';
        const path = `.env.${env}`;
        if (!existsSync(path)) {
          console.info(
            'Application is running with env default: path = .env.development',
          );
          return '.env.development';
        }
        console.info(`Application is running with env path = ${path}`);
        return path;
      })(),
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    MoviesModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
