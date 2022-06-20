import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { STATUS, User } from '.prisma/client';

@Injectable()
export class FollowingsService {
	constructor(public readonly prismaService: PrismaService) {}
	async create(createFollowingDto: CreateFollowingDto, user: User) {
		let relations = await this.prismaService.userRelations.upsert({
			where: {
				followed_user_id_follower_user_id: {
					followed_user_id: createFollowingDto.followed,
					follower_user_id: user.id
				}
			},
			create: {
				followed_user_id: createFollowingDto.followed,
				follower_user_id: user.id,
				status: 'ACTIVE'
			},
			update: {
				followed_user_id: createFollowingDto.followed,
				follower_user_id: user.id,
				status: 'ACTIVE'
			}
		});
		return relations;
	}

	async findAll(user: User) {
		let allFollowings = await this.prismaService.userRelations.findMany({
			where: { follower_user_id: user.id, status: 'ACTIVE' }
		});
		return allFollowings;
	}

	// findOne(id: number) {
	// 	return `This action returns a #${id} following`;
	// }

	async update(id: number, updateFollowingDto: UpdateFollowingDto, user: User) {
		let _user = await this.prismaService.userRelations.update({
			where: { followed_user_id_follower_user_id: { follower_user_id: user.id, followed_user_id: id } },
			data: { status: updateFollowingDto.status, modified_at: new Date() }
		});
		return _user;
	}

	async remove(follower_id: number, user: User) {
		let removed = await this.prismaService.userRelations.update({
			where: { followed_user_id_follower_user_id: { followed_user_id: follower_id, follower_user_id: user.id } },
			data: { status: 'DELETED' }
		});
		return removed;
	}
}
