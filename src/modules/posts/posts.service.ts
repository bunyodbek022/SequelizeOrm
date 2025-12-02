import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Posts } from './entities/post.entity';
import { User } from '../users/entities/users.model';
import { where } from 'sequelize';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts)
    private postsModel: typeof Posts,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(userFromToken, createPostDto: CreatePostDto): Promise<Posts> {
    try {
      if (!userFromToken) throw new UnauthorizedException('User have to login');
      const existUser = await this.userModel.findOne({
        where: { email: userFromToken.email },
      });
      if (!existUser) throw new NotFoundException('User not found');

      const post = await this.postsModel.create({
        title: createPostDto.title,
        userId: existUser.id,
      });

      return post;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('create post  error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during create post',
      );
    }
  }

  async findAll() {
    try {
      return await this.postsModel.findAll();
    } catch (error) {
      console.error('Find all posts error:', error);
      throw new InternalServerErrorException('Cannot fetch posts');
    }
  }

  async findOne(id: number) {
    try {
      const post = this.postsModel.findByPk(id);
      if (!post) throw new NotFoundException('This post not found');

      return post;
    } catch (error) {
      console.error('Find one posts error:', error);
      throw new InternalServerErrorException('Cannot fetch posts');
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, userFromToken) {
    try {
      if (!userFromToken) throw new UnauthorizedException('User have to login');
      const existUser = await this.userModel.findOne({
        where: { email: userFromToken.email },
      });
      if (!existUser) throw new NotFoundException('User not found');
      const updatedPost = await this.postsModel.update(updatePostDto, {
        where: { userId: userFromToken.id, id },
      });
      return updatedPost;
    } catch (error) {
      console.error('Update posts error:', error);
      throw new InternalServerErrorException('Cannot update posts');
    }
  }

  async remove(id: number, userFromToken) {
    try {
      if (!userFromToken) throw new UnauthorizedException('User have to login');
      const existUser = await this.userModel.findOne({
        where: { email: userFromToken.email },
      });
      if (!existUser) throw new NotFoundException('User not found');
      await this.postsModel.destroy({
        where: { userId: userFromToken.id, id },
      });
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Delete posts error:', error);
      throw new InternalServerErrorException('Cannot delete posts');
    }
  }
}
