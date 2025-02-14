import { Task } from "src/tasks/entities/task.entity";
import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}