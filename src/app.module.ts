import { UsersService } from './users/users.service';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentUserMiddleware } from './common/middleware/current.user.middleware';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ContentModule } from './content/content.module';
import { FollowingsModule } from './followings/followings.module';

@Module({
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			imports: [ ConfigModule ],
			useFactory: async () => ({
				secret: 'process.env.JWT_SECRET'
			}),
			inject: [ ConfigService ]
		}),
		ContentModule,
		FollowingsModule
	],
	controllers: [ AppController ],
	providers: [ AppService, PrismaService, UsersService ]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes('*');
	}
}
