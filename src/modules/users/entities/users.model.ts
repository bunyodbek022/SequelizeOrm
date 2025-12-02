import { AllowNull, DataType, HasMany, Model } from 'sequelize-typescript';
import { Column, Table } from 'sequelize-typescript';
import { Posts } from 'src/modules/posts/entities/post.entity';


@Table({ tableName: 'users' })
export class User extends Model<User, { firstname: string , password : string, email: string}> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
   email: string
    
  @Column({
    defaultValue: false,
    allowNull: true
   })
  isActive: boolean;

  @HasMany(() => Posts)
  posts : Posts[]
}
