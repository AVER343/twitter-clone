import { OnlyAuthenticated } from './../common/guards/authenticated.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Response } from 'express';
import { User } from '@prisma/client';
import GetWallDTO from './dto/get-wall.dto';

@UseGuards(OnlyAuthenticated)
@Controller('content')
export class ContentController {
	constructor(private readonly contentService: ContentService) {}

	@Post()
	create(@Body() createContentDto: CreateContentDto, @Req() request: any) {
		let user: User = request.user;

		return this.contentService.create(createContentDto, user);
	}
	@Get('/wall/:page')
	wall(@Req() request: any, @Param('page') page: number) {
		let user: User = request.user;
		return this.contentService.wall(user, page);
	}
	@Get('/all')
	findAll(@Req() request: any) {
		let user: User = request.user;
		return this.contentService.findAll(user);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Req() request: any) {
		return this.contentService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto, @Req() request: any) {
		let user: User = request.user;
		return this.contentService.update(+id, updateContentDto, user);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.contentService.remove(+id);
	}
}
