import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Program } from './program.model';
import { ProgramStyleAmenity } from './programStyleAmenity.model';

@Table({
  tableName: 'program_styles',
  indexes: [
    {
      unique: true,
      fields: ['code']
    }
  ]
})
export class ProgramStyle extends Model<ProgramStyle> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code!: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  slug!: string;

  @HasMany(() => Program, { foreignKey: 'programStyleCode', sourceKey: 'code' })
  programs?: Program[];

  @HasMany(() => ProgramStyleAmenity, { foreignKey: 'programStyleCode', sourceKey: 'code' })
  programStyleAmenities?: ProgramStyleAmenity[];
}
