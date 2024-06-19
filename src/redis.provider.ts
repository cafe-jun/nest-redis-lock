import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisProvider {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setNx(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'PX', 1000, 'NX');
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
