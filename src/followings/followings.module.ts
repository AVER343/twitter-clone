import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { FollowingsController } from './followings.controller';

@Module({
  controllers: [FollowingsController],
  providers: [FollowingsService,PrismaService]
})
export class FollowingsModule {}
