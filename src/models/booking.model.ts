import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Program } from './program.model';

@Table({ tableName: 'bookings' })
export class Booking extends Model<Booking> {
  // name removed

  @Column({ type: DataType.STRING, allowNull: false })
  orderId!: string;
  
  @ForeignKey(() => Program)
  @Column({ type: DataType.STRING, allowNull: false })
  programCode!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  userCode!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;

  @Column(DataType.DATE)
  createdAt?: Date;

  @Column(DataType.DATE)
  updatedAt?: Date;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code!: string;

  @BelongsTo(() => Program, { foreignKey: 'programCode', targetKey: 'code' })
  program?: Program;

  @BelongsTo(() => User, { foreignKey: 'userCode', targetKey: 'code' })
  user?: User;
}
