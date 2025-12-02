import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Post, Put, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggingInteraptor } from 'src/interaptors/loggingInteraptor';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { LoginDto } from './dto/login.user.Dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@UseInterceptors(LoggingInteraptor) // 2-usul
export class UsersController {
    constructor(private readonly userService: UsersService) { }
    
    @Get()
    // @UseInterceptors(LoggingInteraptor) 1-usul
    @UseGuards(AuthGuard)
    getAllUsers() {
        return this.userService.findAll()
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    getOne(@Request() req, @Param('id') id : string) {
        return this.userService.findOne(+id, req.user);
    }

    @Post('register')
    registerUser(@Body() payload: CreateUserDto) {
        return this.userService.register(payload);
    }

    @Post('login')
    loginUser(@Body() payload: LoginDto) {
        return this.userService.login(payload);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    updateUser(@Request() req, @Param('id') id: string, @Body() payload : UpdateUserDto) {
        return this.userService.update(+id, payload, req.user);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteUser(@Request() req, @Param('id') id: string, @Query('force' , ParseBoolPipe) force : boolean, ) {
        return this.userService.delete(+id, req.user, force);
    }
}
