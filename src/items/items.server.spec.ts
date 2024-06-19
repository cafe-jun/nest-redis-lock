import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { RedisProvider } from '../redis.provider';

describe('[Item][Service]', () => {
  let itemsService: ItemsService;
  let clearRedis: Redis;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule.forRoot({
          type: 'single',
          url: 'redis://localhost:6379',
        }),
      ],
      providers: [
        ItemsService,
        RedisProvider,
        {
          provide: 'Redis',
          useFactory: () =>
            new Redis({
              host: 'localhost',
              port: 6379,
            }),
        },
      ],
    }).compile();
    itemsService = module.get<ItemsService>(ItemsService);
    clearRedis = module.get<Redis>('Redis');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(async () => {
    await clearRedis.del('LIKE');
  });

  describe('[아이템 좋아요 올리기]', () => {
    it('[Lock 적용] 상품 좋아요 10개 올리기 ', async () => {
      const apiCall = [];
      for (let index = 0; index < 10; index++) {
        apiCall.push(itemsService.increaseLikeMutex(1));
      }
      await Promise.all(apiCall);
      const like = await itemsService.findLike();
      expect(like).toBe(apiCall.length);
    });

    it('[Lock 미적용] 상품 좋아요 10개 올리기 ', async () => {
      const apiCall = [];
      for (let index = 0; index < 10; index++) {
        apiCall.push(itemsService.increaseSimpleLike(1));
      }
      await Promise.all(apiCall);
      const like = await itemsService.findLike();
      expect(like).toBe(apiCall.length);
    });
  });
});
