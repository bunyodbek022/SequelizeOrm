import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/users.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [SequelizeModule.forFeature([User]),
   SequelizeModule.forFeature([User]),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  })],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
