import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '@prisma/client';
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(public userService: UsersService) {}
	async use(req: any, res: Response, next: Function) {
		let user = null;
		let token = (req.cookies && req.cookies['JWT']) || null;
		if (token) {
			console.log(token);
			let __user = await this.userService.verifyJWT(token);
			if (__user) {
				user = await this.userService.findById(__user.user.id);
			}
		}
		req.user = user;
		next();
	}
}
