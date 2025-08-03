import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Payment } from './payment.model';
import { User } from './user.model';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: true })
  userCode?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalAmount!: number;

  @BelongsTo(() => User, { foreignKey: 'userCode', targetKey: 'code' })
  user?: User;

  @HasMany(() => Payment)
  payments!: Payment[];
}
