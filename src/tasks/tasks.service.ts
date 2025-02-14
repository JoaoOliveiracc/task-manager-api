import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Redis from 'ioredis';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async findAll(page: number = 1, pageSize: number = 10): Promise<Task[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const cacheKey = `tasks:all:${page}:${pageSize}`;

    const cachedTasks = await this.redis.get(cacheKey);

    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const [tasks, total] = await this.tasksRepository.findAndCount({
      skip,
      take,
    });

    await this.redis.set(cacheKey, JSON.stringify(tasks), 'EX', 3600);

    console.log('Retornando dados do banco de dados');
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.tasksRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
