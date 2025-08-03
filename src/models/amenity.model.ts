import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { FacilityAmenity } from './facilityAmenity.model';
import { ProgramStyleAmenity } from './programStyleAmenity.model';

@Table({ tableName: 'amenities' })
export class Amenity extends Model<Amenity> {
  @Column(DataType.ARRAY(DataType.STRING))
  images!: string[];
  
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  category!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @HasMany(() => FacilityAmenity, { foreignKey: 'amenityCode', sourceKey: 'code' })
  facilityAmenities?: FacilityAmenity[];

  @HasMany(() => ProgramStyleAmenity, { foreignKey: 'amenityCode', sourceKey: 'code' })
  programStyleAmenities?: ProgramStyleAmenity[];
}
