import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { lock } from 'simple-redis-mutex';
import { RedisProvider } from '../redis.provider';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly redisProvider: RedisProvider,
  ) {}

  async increaseLikeMutex(inputCount: number): Promise<void> {
    const release = await lock(this.redis, 'like', { fifo: true });
    const count = await this.findLike();
    const total = count + inputCount;
    await this.redis.set('LIKE', total);
    await release();
  }

  async increaseSimpleLike(inputCount: number): Promise<void> {
    const count = await this.findLike();
    const total = count + inputCount;
    await this.redis.set('LIKE', total);
  }

  async findLike(): Promise<number> {
    const like = await this.redis.get('LIKE');
    return like ? Number.parseInt(like) : 0;
  }
}
