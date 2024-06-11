import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

describe('[Item][Service]', () => {
  let itemsService: ItemsService;
  let redis: Redis;
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
    redis = module.get<Redis>('Redis');
    await redis.del('LIKE');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('[아이템 좋아요 올리기]', () => {
    it('상품 좋아요 10개 올리기', async () => {
      const apiCall = [
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
        itemsService.increaseLike(1),
      ];
      await Promise.all(apiCall);
      const like = await itemsService.findLike();
      expect(Number.parseInt(like)).toBe(apiCall.length);
    });
  });
});
