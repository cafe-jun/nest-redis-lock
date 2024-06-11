import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { lock } from 'simple-redis-mutex';

@Injectable()
export class ItemsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async increaseLike(inputCount: number): Promise<void> {
    const release = await lock(this.redis, 'like', { fifo: true });
    const count = await this.redis.get('LIKE');
    const total = +count + inputCount;
    await this.redis.set('LIKE', total);
    await release();
  }

  async findLike(): Promise<string> {
    return await this.redis.get('LIKE');
  }
}
