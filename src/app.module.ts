import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ItemsService } from './items/items.service';
import { RedisProvider } from './redis.provider';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ItemsService, RedisProvider],
})
export class AppModule {}
