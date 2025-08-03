import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProgramStyle } from './programStyle.model';
import { Amenity } from './amenity.model';

@Table({ tableName: 'program_style_amenities' })
export class ProgramStyleAmenity extends Model<ProgramStyleAmenity> {
  @ForeignKey(() => ProgramStyle)
  @Column({ type: DataType.STRING, allowNull: false })
  programStyleCode!: string;

  @ForeignKey(() => Amenity)
  @Column({ type: DataType.STRING, allowNull: false })
  amenityCode!: string;

  @BelongsTo(() => ProgramStyle, { foreignKey: 'programStyleCode', targetKey: 'code' })
  programStyle?: ProgramStyle;

  @BelongsTo(() => Amenity, { foreignKey: 'amenityCode', targetKey: 'code' })
  amenity?: Amenity;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;
}