import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Posts } from './entities/post.entity';
import { User } from '../users/entities/users.model';


@Module({
  imports: [SequelizeModule.forFeature([Posts, User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
