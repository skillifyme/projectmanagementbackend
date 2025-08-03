import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Facility } from './facility.model';
import { FacilityAmenity } from './facilityAmenity.model';
import { ProgramStyle } from './programStyle.model';
import { Booking } from './booking.model';
import { Review } from './review.model';
import { ProgramServiceMap } from './programServiceMap.model';

@Table({ tableName: 'wellness_programs' })
export class Program extends Model<Program> {
  @Column(DataType.BOOLEAN)
  approved!: boolean;

  @HasMany(() => FacilityAmenity)
  programAmenities?: FacilityAmenity[];
  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;

  @Column(DataType.FLOAT)
  price!: number;

  @Column({ type: DataType.STRING, unique: true })
  name!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code!: string;

  @Column(DataType.TEXT)
  description?: string;

  @ForeignKey(() => ProgramStyle)
  @Column({ type: DataType.STRING, allowNull: false })
  programStyleCode!: string;

  @Column(DataType.ARRAY(DataType.STRING))
  images!: string[];

  @Column(DataType.JSONB)
  programConfig!: any;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  creatorCode!: string;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.STRING, allowNull: false })
  primaryFacilityCode!: string;

  @BelongsTo(() => User, { foreignKey: 'creatorCode', targetKey: 'code' })
  creator?: User;

  @BelongsTo(() => ProgramStyle, { foreignKey: 'programStyleCode', targetKey: 'code' })
  programStyle?: ProgramStyle;

  @BelongsTo(() => Facility, { foreignKey: 'primaryFacilityCode', targetKey: 'code' })
  facility?: Facility;

  @HasMany(() => Booking, { foreignKey: 'programCode', sourceKey: 'code' })
  bookings?: Booking[];

  @HasMany(() => Review, { foreignKey: 'programCode', sourceKey: 'code' })
  reviews?: Review[];

  @HasMany(() => ProgramServiceMap, { foreignKey: 'programCode', sourceKey: 'code' })
  programServices?: ProgramServiceMap[];
}
