import { STATUS } from '.prisma/client';
import { PartialType } from '@nestjs/swagger';
import { Contains, IsEnum, IsString } from 'class-validator';
import { CreateFollowingDto } from './create-following.dto';

export class UpdateFollowingDto extends PartialType(CreateFollowingDto) {
	@IsString()
	@IsEnum(STATUS)
	status: STATUS;
}
