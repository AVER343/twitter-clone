import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@Length(1, 127)
	username: string;
	@Length(1, 127)
	@IsString()
	password: string;
}
