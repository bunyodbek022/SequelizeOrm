import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Posts } from './entities/post.entity';
import { User } from '../users/entities/users.model';
import { UsersService } from '../users/users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [SequelizeModule.forFeature([Posts, User]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthGuard],
})
export class PostsModule {}
