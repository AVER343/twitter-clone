import { OnlyAuthenticated } from './../common/guards/authenticated.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { FollowingsService } from './followings.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { UpdateFollowingDto } from './dto/update-following.dto';
import { Response } from 'express';
@UseGuards(OnlyAuthenticated)
@Controller('followings')
export class FollowingsController {
	constructor(private readonly followingsService: FollowingsService) {}

	@Post()
	create(@Body() createFollowingDto: CreateFollowingDto, @Req() request: any) {
		let user = request.user;
		return this.followingsService.create(createFollowingDto, user);
	}

	@Get()
	findAll(@Req() request: any) {
		let user = request.user;
		return this.followingsService.findAll(user);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateFollowingDto: UpdateFollowingDto, @Req() req: any) {
		const user = req.user;
		return this.followingsService.update(+id, updateFollowingDto, user);
	}

	@Delete(':id')
	remove(@Param('id') follower_id: string, @Req() request: any) {
		let user = request.user;
		return this.followingsService.remove(+follower_id, user);
	}
}
