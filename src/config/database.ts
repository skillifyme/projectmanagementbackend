import { Sequelize } from 'sequelize-typescript';
import { Client } from 'pg';
import { User } from '../models/user.model';
import { Facility } from '../models/facility.model';
import { Program } from '../models/program.model';
import { ProgramStyle } from '../models/programStyle.model';
import { FacilityAmenity } from '../models/facilityAmenity.model';
import { Amenity } from '../models/amenity.model';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { ProgramServiceMap } from '../models/programServiceMap.model';
import { ProgramStyleAmenity } from '../models/programStyleAmenity.model';
import dotenv from 'dotenv';
dotenv.config();

async function ensureDatabaseExists() {
  const client = new Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: 'postgres', // connect to default db
  });
  await client.connect();
  const dbName = process.env.POSTGRES_DB;
  const result = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }
  await client.end();
}

// Ensure DB exists before Sequelize init
export const sequelizeReady = (async () => {
  await ensureDatabaseExists();
  return new Sequelize({
    dialect: 'postgres',
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.POSTGRES_DB,
    models: [
      User,
      Facility,
      Program,
      ProgramStyle,
      FacilityAmenity,
      Amenity,
      Booking,
      Review,
      Country,
      City,
      Order,
      Payment,
      ProgramServiceMap,
      ProgramStyleAmenity
    ],
  });
})();
