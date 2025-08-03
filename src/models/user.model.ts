import { Table, Column, Model, DataType, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Booking } from './booking.model';
import { Review } from './review.model';
import { Order } from './order.model';
import { Facility } from './facility.model';
import { Program } from './program.model';
import { hashPassword } from '../utils/password.util';

@Table({ tableName: 'users', timestamps: true }) // Added timestamps for safety
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
    validate: { isEmail: true }
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true // Explicitly mark optional fields
  })
  password?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  googleId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user' // Added default value
  })
  role!: 'admin' | 'user' | 'facility';

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  code!: string;

  @HasMany(() => Booking, { foreignKey: 'userCode', sourceKey: 'code' })
  bookings?: Booking[];

  @HasMany(() => Review, { foreignKey: 'userCode', sourceKey: 'code' })
  reviews?: Review[];

  @HasMany(() => Order, { foreignKey: 'userCode', sourceKey: 'code' })
  orders?: Order[];

  @HasMany(() => Facility, { foreignKey: 'userCode', sourceKey: 'code' })
  facilities?: Facility[];

  @HasMany(() => Program, { foreignKey: 'creatorCode', sourceKey: 'code' })
  createdPrograms?: Program[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPasswordBeforeSave(instance: User) {
    if (instance.changed('password') && instance.password) {
      instance.password = await hashPassword(instance.password);
    }
  }
}
