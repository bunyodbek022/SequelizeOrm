import {
  Body,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/users.model';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.user.Dto';
import { JwtService } from '@nestjs/jwt';
import { Posts } from '../posts/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,

    @InjectModel(Posts)
    private postModel: typeof Posts,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.findAll();
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Register error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async findOne(id: number, userFromToken) {
    try {
      if (userFromToken.id !== id)
        throw new NotAcceptableException("You don't have access");
      const userExist = await this.userModel.findOne({
        where: { id },
        include: [Posts],
      });
      if (!userExist) throw new NotFoundException('User not found');
      const { password, ...userPlain } = userExist.get({ plain: true });
      return userPlain;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('find one user error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during find one user',
      );
    }
  }

  async register(@Body() userDto: CreateUserDto) {
    try {
      if (!userDto) {
        throw new NotFoundException('Body is empty');
      }
      const existUser = await this.userModel.findOne({
        where: { email: userDto.email },
      });
      if (existUser) throw new ConflictException();
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const user = await this.userModel.create({
        firstname: userDto.firstname,
        password: hashedPassword,
        email: userDto.email,
      });
      const { password, ...userPlain } = user.get({ plain: true });
      return userPlain;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Register error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const Exist = await this.userModel.findOne({
        where: { email: loginDto.email },
      });

      const userExist = Exist?.dataValues;
      console.log(loginDto);
      if (!userExist) throw new UnauthorizedException('User not found');
      const isMatch = await bcrypt.compare(
        loginDto.password,
        userExist.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Password is incorrect');
      }
      const token = this.jwtService.sign({
        id: userExist.id,
        email: userExist.email,
      });

      const { password, ...userPlain } = Exist.get({ plain: true });
      const id = userPlain.id;
      await this.userModel.update({ isActive: true }, { where: { id } });
      return { message: 'Login successful', token, data: userPlain };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('login error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }

  async update(id: number, dto: UpdateUserDto, userFromToken) {
    try {
      if (userFromToken.id !== id)
        throw new NotAcceptableException("You don't have access");
      const userExist = this.findOne(id, userFromToken);
      if (!userExist) throw new UnauthorizedException('User not found');
      await this.userModel.update(dto, { where: { id } });
      return this.findOne(id, userFromToken);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Register error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async delete(id: number, userFromToken, force: boolean) {
    try {
      if (userFromToken.id !== id)
        throw new NotAcceptableException("You don't have access");
      const userExist = await this.userModel.findOne({
        where: { id },
        include: [this.postModel],
      });
      if (!userExist) throw new UnauthorizedException('User not found');
      if (force) {
        await this.postModel.destroy({ where: { userId: userFromToken.id } });
        await this.userModel.destroy({ where: { id } });
        return { message: 'User deleted succesfully' };
      }
      if ((await userExist).posts.length > 0)
        throw new NotAcceptableException(
          'Firtly You have to delete your posts',
        );
      await this.userModel.destroy({ where: { id } });
      return { message: 'User deleted succesfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('delete user error:', error);
      throw new InternalServerErrorException(
        'Something went wrong during delete user',
      );
    }
  }
}
