import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Country } from './country.model';

@Table({ tableName: 'cities' })
export class City extends Model<City> {
  @Column(DataType.ARRAY(DataType.STRING))
  images!: string[];

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.STRING, unique: true })
  code?: string;

  @Column({ type: DataType.STRING, unique: true })
  slug?: string;

  @ForeignKey(() => Country)
  @Column({ type: DataType.STRING, allowNull: false })
  countryCode!: string;

  @BelongsTo(() => Country, { foreignKey: 'countryCode', targetKey: 'code' })
  country?: Country;
}
