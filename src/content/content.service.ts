import { PrismaService } from './../prisma/prisma.service';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
	constructor(public readonly prismaService: PrismaService) {}
	async create(createContentDto: CreateContentDto, user: User) {
		let content = await this.prismaService.post.create({
			data: {
				authorId: user.id,
				content: createContentDto.content,
				title: createContentDto.title
			}
		});
		return content;
	}

	async findAll(user: User) {
		let posts = await this.prismaService.post.findMany({ where: { authorId: user.id } });
		return posts;
	}

	findOne(id: number) {
		return `This action returns a #${id} content`;
	}
	async wall(user: User, page: number) {
		let following_users = await this.prismaService.userRelations.findMany({
			where: { follower_user_id: user.id, status: 'ACTIVE' }
		});
		let content = await this.prismaService.post.findMany({
			take: page * 10,
			skip: (page - 1) * 10,
			where: { authorId: { in: following_users.map((e) => e.followed_user_id) }, status: 'ACTIVE' },
			include: {
				author: true
			},
			orderBy: { id: 'desc' }
		});
		return content;
	}

	async update(id: number, updateContentDto: UpdateContentDto, user: User) {
		let post = await this.prismaService.post.findFirst({ where: { authorId: user.id, id } });
		if (post)
			post = await this.prismaService.post.update({
				where: { id: post.id },
				data: { ...post, ...updateContentDto }
			});
		else throw new Error('Something went wrong !');
		return post;
	}

	remove(id: number) {
		return `This action removes a #${id} content`;
	}
}
