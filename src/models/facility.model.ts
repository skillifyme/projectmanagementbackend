import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { FacilityAmenity } from './facilityAmenity.model';
import { Program } from './program.model';

@Table({ tableName: 'facilities' })
export class Facility extends Model<Facility> {
  @Column(DataType.ARRAY(DataType.STRING))
  images!: string[];
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;

  @Column(DataType.STRING)
  description!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ctype!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  subtype!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  city!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  country!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  latitude!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  longitude!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  pincode!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  contactNumber!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  userCode!: string;

  @BelongsTo(() => User, { foreignKey: 'userCode', targetKey: 'code' })
  user?: User;

  @HasMany(() => FacilityAmenity, { foreignKey: 'facilityCode', sourceKey: 'code' })
  facilityAmenities?: FacilityAmenity[];

  @HasMany(() => Program, { foreignKey: 'primaryFacilityCode', sourceKey: 'code' })
  programs?: Program[];
}
