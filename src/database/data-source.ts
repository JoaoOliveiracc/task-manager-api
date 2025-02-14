import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'task_manager',
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  entities: [User, Task],
});
