import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { Program } from './program.model';
import { FacilityAmenity } from './facilityAmenity.model';

@Table({ tableName: 'program_service_map' })
export class ProgramServiceMap extends Model<ProgramServiceMap> {
  @ForeignKey(() => Program)
  @Column(DataType.STRING)
  programCode!: string;

  @ForeignKey(() => FacilityAmenity)
  @Column(DataType.INTEGER)
  facilityAmenityId!: number;

  @Column(DataType.INTEGER)
  quantity!: number;

  @BelongsTo(() => Program, { foreignKey: 'programCode', targetKey: 'code' })
  program?: Program;

  @BelongsTo(() => FacilityAmenity)
  facilityAmenity?: FacilityAmenity;
}
