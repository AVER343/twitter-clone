import { OnlyAuthenticated } from './../common/guards/authenticated.guard';
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpException,
	HttpStatus,
	Res,
	UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/')
	async create(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true })
		response: Response
	) {
		try {
			let _user = await this.usersService.create(createUserDto);
			let JWT = await this.usersService.getJWT(_user.user);
			response.cookie('JWT', JWT);
			return _user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.FORBIDDEN,
					error: error.message
				},
				HttpStatus.FORBIDDEN
			);
		}
	}
	@Post('/login')
	async login(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true })
		response: Response
	) {
		try {
			let _user = await this.usersService.login(createUserDto);
			if (!_user) throw new Error('Error logging in !');
			let JWT = await this.usersService.getJWT(_user.user);
			response.cookie('JWT', JWT);
			return _user;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.FORBIDDEN,
					error: error.message
				},
				HttpStatus.FORBIDDEN
			);
		}
	}
	@Get()
	findAll() {
		return this.usersService.findAll();
	}
	
	@UseGuards(OnlyAuthenticated)
	@Get('/logout')
	async logout(
		@Res({ passthrough: true })
		response: Response
	) {
		response.clearCookie('JWT');
		return {
			status: 200,
			message: 'Logged out !'
		};
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.usersService.findOne(+id);
	}
	
	@UseGuards(OnlyAuthenticated)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(+id, updateUserDto);
	}

	@UseGuards(OnlyAuthenticated)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.usersService.remove(+id);
	}
}
