import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Facility } from './facility.model';
import { Amenity } from './amenity.model';
import { Program } from './program.model';

@Table({ 
  tableName: 'facility_amenities',
  indexes: [
    {
      fields: ['programCode']
    },
    {
      fields: ['facilityCode']
    },
    {
      fields: ['amenityCode']
    }
  ]
})
export class FacilityAmenity extends Model<FacilityAmenity> {
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  images!: string[];

  @ForeignKey(() => Program)
  @Column({ 
    type: DataType.STRING, 
    allowNull: false,
    references: {
      model: 'wellness_programs',
      key: 'code'
    }
  })
  programCode!: string;

  @BelongsTo(() => Program, { foreignKey: 'programCode', targetKey: 'code' })
  program?: Program;

  @ForeignKey(() => Facility)
  @Column({ 
    type: DataType.STRING, 
    allowNull: false,
    references: {
      model: 'facilities',
      key: 'code'
    }
  })
  facilityCode!: string;

  @ForeignKey(() => Amenity)
  @Column({ 
    type: DataType.STRING, 
    allowNull: false,
    references: {
      model: 'amenities',
      key: 'code'
    }
  })
  amenityCode!: string;

  @BelongsTo(() => Facility, { foreignKey: 'facilityCode', targetKey: 'code' })
  facility?: Facility;

  @BelongsTo(() => Amenity, { foreignKey: 'amenityCode', targetKey: 'code' })
  amenity?: Amenity;

  @Column({ type: DataType.STRING, allowNull: false })
  unit!: string; // night, day, hour, session

  @Column(DataType.INTEGER)
  capacity?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;
}
