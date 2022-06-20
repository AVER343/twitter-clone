import { Test, TestingModule } from '@nestjs/testing';
import { FollowingsController } from './followings.controller';
import { FollowingsService } from './followings.service';

describe('FollowingsController', () => {
  let controller: FollowingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowingsController],
      providers: [FollowingsService],
    }).compile();

    controller = module.get<FollowingsController>(FollowingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
