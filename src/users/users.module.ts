import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
	controllers: [ UsersController ],
	imports: [
		JwtModule.registerAsync({
			imports: [ ConfigModule ],
			useFactory: async () => ({
				secret: 'process.env.JWT_SECRET'
			}),
			inject: [ ConfigService ]
		})
	],
	providers: [ UsersService, PrismaService ]
})
export class UsersModule {}
