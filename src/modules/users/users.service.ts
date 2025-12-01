import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/users.model';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.findAll();
    } catch (error) {
      throw new Error();
    }
  }

  async findOne(id: number) {
    try {
      return this.userModel.findByPk(id);
    } catch (error) {
      throw new Error();
    }
  }

  async create(userDto: any): Promise<User> {
    try {
      return this.userModel.create(userDto);
    } catch (error) {
      throw new Error();
    }
  }
  async update(id: number, dto: UpdateUserDto) {
    try {
      await this.userModel.update(dto, { where: { id } });
      return this.findOne(id);
    } catch (error) {
      throw new Error();
    }
  }

  async delete(id: number) {
    try {
      return this.userModel.destroy({ where: { id } });
    } catch (error) {
      throw new Error();
    }
  }
}
