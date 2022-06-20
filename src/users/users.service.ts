import { OnlyAuthenticated } from './../common/guards/authenticated.guard';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { User } from '@prisma/client';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
const scrypt = promisify(_scrypt);
@Injectable()
export class UsersService {
	constructor(public readonly prismaService: PrismaService, public jwtService: JwtService) {}
	async findById(id: number): Promise<User | null> {
		if (!id) {
			return null;
		}
		let user = await this.prismaService.user.findFirst({ where: { id } });
		return user;
	}
	async findByUsername(username: string, otherfilters: Partial<User>): Promise<User | null> {
		if (!username || username == '') {
			return null;
		}
		let user = await this.prismaService.user.findFirst({ where: { username, ...otherfilters } });
		return user;
	}
	async create({ username, password }: CreateUserDto): Promise<{ user: User } | null> {
		try {
			let doesUserExist = await this.findByUsername(username, {});
			if (doesUserExist) throw new Error('User with same username exists !');
			let newUser = await this.prismaService.user.create({ data: { username } });
			//create salt
			const salt = randomBytes(12).toString('hex');

			//Generate hash
			const hash = (await scrypt(password, salt, 64)) as Buffer;

			//password would be hash and salt
			password = hash.toString('hex') + '.' + salt;

			//save user
			await this.prismaService.userCredentials.create({
				data: { user_id: newUser.id, password }
			});
			return { user: newUser };
		} catch (e) {
			throw new Error('User could not be created !');
		}
	}
	async getJWT(user: User) {
		let token = await this.jwtService.signAsync({ user, created_at: Date.now() }, { expiresIn: '3d' });
		return token;
	}
	async findAll() {
		return await this.prismaService.user.findMany();
	}
	async login(loginUserDTO: CreateUserDto): Promise<{ user: User } | null> {
		let user = await this.findByUsername(loginUserDTO.username, { status: 'ACTIVE' });
		if (!user) throw new Error('User not found !');
		let user_credentials = await this.prismaService.userCredentials.findFirst({ where: { user_id: user.id } });
		const [ hashedPassword, salt ] = user_credentials.password.split('.');
		const buf = (await scrypt(loginUserDTO.password, salt, 64)) as Buffer;
		if (buf.toString('hex') === hashedPassword) return { user };
		return null;
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}
	async verifyJWT(JWT: string): Promise<{ user: User }> {
		let verified_user = await this.jwtService.verifyAsync(JWT);
		return verified_user;
	}
	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
