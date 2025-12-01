import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/entities/users.model';
import { Posts } from './modules/posts/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
       useFactory: (config: ConfigService) => ({
         secret: config.get<any>('JWT_SECRET'),
         signOptions: { expiresIn: '1d' },
      })
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: config.get<any>('DB_DIALECT'),
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        models: [User, Posts],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([User, Posts]),
    UsersModule,    
    PostsModule,  
  ], 
})
export class AppModule {}
