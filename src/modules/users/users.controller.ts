import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggingInteraptor } from 'src/interaptors/loggingInteraptor';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('users')
@UseInterceptors(LoggingInteraptor) // 2-usul
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    
    @Get()
    // @UseInterceptors(LoggingInteraptor) 1-usul
    getAllUsers() {
        this.userService.findAll()
    }

    @Get(':id')
    getOne(@Param('id') id : string) {
        this.userService.findOne(+id);
    }

    @Post()
    createUser(@Body() payload: CreateUserDto) {
        this.userService.create(payload);
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() payload : UpdateUserDto) {
        this.userService.update(+id, payload);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        this.userService.delete(+id);
    }
}
