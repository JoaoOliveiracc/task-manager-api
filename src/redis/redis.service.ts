import { Injectable, Inject } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis.Redis) { }

  // Armazena tarefas no Redis
  async setTasksCache(key: string, tasks: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(tasks), 'EX', 3600); // Cache expira em 1 hora
  }

  // Recupera tarefas do cache
  async getTasksCache(key: string): Promise<any> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
}