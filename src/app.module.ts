import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Task],
      synchronize: true,
    }),
    UserModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
