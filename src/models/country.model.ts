import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { City } from './city.model';

@Table({ tableName: 'countries' })
export class Country extends Model<Country> {
  @Column(DataType.ARRAY(DataType.STRING))
  images!: string[];

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;

  @Column({type: DataType.STRING, allowNull: false })
  status?: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false  })
  code?: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false  })
  slug?: string;

  @HasMany(() => City, { foreignKey: 'countryCode', sourceKey: 'code' })
  cities?: City[];
}
