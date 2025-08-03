import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Program } from './program.model';

@Table({ tableName: 'reviews' })
export class Review extends Model<Review> {
  @ForeignKey(() => Program)
  @Column(DataType.STRING)
  programCode!: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  userCode!: string;

  @Column(DataType.INTEGER)
  rating!: number;

  @Column(DataType.TEXT)
  comment?: string;

  @BelongsTo(() => Program, { foreignKey: 'programCode', targetKey: 'code' })
  program?: Program;

  @BelongsTo(() => User, { foreignKey: 'userCode', targetKey: 'code' })
  user?: User;
}
