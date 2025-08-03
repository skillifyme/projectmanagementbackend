import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from './order.model';

@Table({ tableName: 'payments' })
export class Payment extends Model<Payment> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  transactionId!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column(DataType.DATE)
  paidAt!: Date;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId!: number;

  @BelongsTo(() => Order)
  order?: Order;
}
