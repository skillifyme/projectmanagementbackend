// Script to push dummy data into the database for development/testing
// Run with: npx ts-node src/scripts/seedDummyData.ts

import { sequelizeReady } from '../config/database';
import { Program } from '../models/program.model';
import { Facility } from '../models/facility.model';
import { Amenity } from '../models/amenity.model';
import { User } from '../models/user.model';
import { ProgramStyle } from '../models/programStyle.model';
import { FacilityAmenity } from '../models/facilityAmenity.model';
import { Country } from '../models/country.model';
import { City } from '../models/city.model';
import { Payment } from '../models/payment.model';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';
import { Order } from '../models/order.model';
import { ProgramServiceMap } from '../models/programServiceMap.model';
import { ProgramStyleAmenity } from '../models/programStyleAmenity.model';
import * as fs from 'fs';
import * as path from 'path';

async function seedDummyData() {
  const sequelize = await sequelizeReady;
  
  // Sync all tables including program_style_amenities
  console.log('Syncing database tables...');
  await sequelize.sync({ force: false });
  
  // Explicitly sync ProgramStyleAmenity model to ensure table creation
  console.log('Ensuring program_style_amenities table exists...');
  await ProgramStyleAmenity.sync({ force: false });
  
  // Verify table exists by doing a simple query
  try {
    await ProgramStyleAmenity.findAll({ limit: 1 });
    console.log('✓ program_style_amenities table verified');
  } catch (error: any) {
    console.error('✗ program_style_amenities table verification failed:', error.message);
  }
  
  console.log('✓ Database tables synced');

  // Optional: Clear existing data (uncomment if you want to start fresh)
  console.log('Clearing existing data...');
  await ProgramStyleAmenity.destroy({ where: {} });
  await FacilityAmenity.destroy({ where: {} });
  await ProgramServiceMap.destroy({ where: {} });
  await Review.destroy({ where: {} });
  await Booking.destroy({ where: {} });
  await Payment.destroy({ where: {} });
  await Order.destroy({ where: {} });
  await Program.destroy({ where: {} });
  await Amenity.destroy({ where: {} });
  await ProgramStyle.destroy({ where: {} });
  await Facility.destroy({ where: {} });
  await City.destroy({ where: {} });
  await Country.destroy({ where: {} });
  await User.destroy({ where: {} });
  console.log('✓ Cleared existing data');

  console.log('Starting data seeding...');

  // Load facility data from JSON file
  const facilityDataPath = path.join(__dirname, 'facility_data.json');
  const facilityJsonData = JSON.parse(fs.readFileSync(facilityDataPath, 'utf8'));

  // Load country and city data from JSON file
  const countryCityDataPath = path.join(__dirname, 'country_city.json');
  const countryCityData = JSON.parse(fs.readFileSync(countryCityDataPath, 'utf8'));

  // Create Users for different roles
  const users = {
    admin: null as any,
    user: null as any,
    facility: null as any
  };

  // Create Admin User
  try {
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (existingAdmin) {
      users.admin = existingAdmin;
      console.log('⚠ Admin user already exists: admin@example.com');
    } else {
      users.admin = await User.create({
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        code: 'usr' + Math.random().toString(16).substring(2, 8)
      } as any);
      console.log('✓ Created admin user: admin@example.com');
    }
  } catch (error:any) {
    console.error('✗ Failed to create admin user:', error.message);
    console.log('⚠ Continuing with dummy admin user...');
    users.admin = { id: 1, email: 'admin@dummy.com', role: 'admin' };
  }

  // Create Regular User
  try {
    const existingUser = await User.findOne({ where: { email: 'user@example.com' } });
    if (existingUser) {
      users.user = existingUser;
      console.log('⚠ Regular user already exists: user@example.com');
    } else {
      users.user = await User.create({
        email: 'user@example.com',
        password: 'password123',
        role: 'user',
        code: 'usr' + Math.random().toString(16).substring(2, 8)
      } as any);
      console.log('✓ Created regular user: user@example.com');
    }
  } catch (error:any) {
    console.error('✗ Failed to create regular user:', error.message);
    console.log('⚠ Continuing with dummy regular user...');
    users.user = { id: 2, email: 'user@dummy.com', role: 'user' };
  }

  // Create Facility User
  try {
    const existingFacility = await User.findOne({ where: { email: 'facility@example.com' } });
    if (existingFacility) {
      users.facility = existingFacility;
      console.log('⚠ Facility user already exists: facility@example.com');
    } else {
      users.facility = await User.create({
        email: 'facility@example.com',
        password: 'password123',
        role: 'facility',
        code: 'usr' + Math.random().toString(16).substring(2, 8)
      } as any);
      console.log('✓ Created facility user: facility@example.com');
    }
  } catch (error:any) {
    console.error('✗ Failed to create facility user:', error.message);
    console.log('⚠ Continuing with dummy facility user...');
    users.facility = { id: 3, email: 'facility@dummy.com', role: 'facility' };
  }

  // Use admin user for the rest of the seed data
  const user = users.admin;

  // Test Country creation to debug validation issues
  try {
    console.log('Testing country creation with minimal data...');
    const testCountry = await Country.create({
      name: 'Test Country',
      status: 'active',
      code: 'TEST',
      slug: 'test-country',
      images: []
    } as any);
    console.log('✓ Test country created successfully, proceeding with full data...');
    await testCountry.destroy(); // Clean up test
  } catch (testError: any) {
    console.error('✗ Test country creation failed:', testError.message);
    console.error('Validation details:', testError.errors || testError);
  }

  // Create Countries from JSON data
  console.log(`Loading ${countryCityData.countries.length} countries...`);
  const countries = [];
  for (const countryData of countryCityData.countries) {
    try {
      // Check if country already exists
      const existingCountry = await Country.findOne({ where: { code: countryData.code } });
      if (existingCountry) {
        countries.push(existingCountry);
        console.log(`⚠ Country already exists: ${countryData.name} (${countryData.code})`);
        continue;
      }

      // Try with minimal required fields first
      const countryPayload = {
        name: countryData.name,
        status: countryData.status || 'active',
        code: countryData.code,
        slug: countryData.slug,
        images: Array.isArray(countryData.images) ? countryData.images : []
      };
      
      const country = await Country.create(countryPayload as any);
      countries.push(country);
      console.log(`✓ Created country: ${countryData.name} (${countryData.code})`);
    } catch (error:any) {
      console.error(`✗ Failed to create country: ${countryData.name}`, error.message);
      
      // Try with even more minimal data
      try {
        const minimalPayload = {
          name: countryData.name,
          status: 'active',
          code: countryData.code,
          slug: countryData.slug || countryData.name.toLowerCase(),
          images: []
        };
        
        const country = await Country.create(minimalPayload as any);
        countries.push(country);
        console.log(`✓ Created country (minimal): ${countryData.name} (${countryData.code})`);
      } catch (minimalError: any) {
        console.error(`✗ Failed to create minimal country: ${countryData.name}`, minimalError.message);
        
        // Try to find existing country as fallback
        try {
          const existingByName = await Country.findOne({ where: { name: countryData.name } });
          if (existingByName) {
            countries.push(existingByName);
            console.log(`⚠ Found existing country by name: ${countryData.name}`);
          }
        } catch (fallbackError: any) {
          console.error('Country fallback lookup failed:', fallbackError.message);
        }
      }
    }
  }
  console.log(`Total countries available: ${countries.length}`);

  // Create city-to-country mapping based on known data
  const cityCountryMapping: { [key: string]: string } = {
    'Delhi': 'IN', 'Mumbai': 'IN', 'Bangalore': 'IN', 'Jaipur': 'IN', 'Agra': 'IN', 'Udaipur': 'IN', 'Chennai': 'IN',
    'Beijing': 'CN', 'Shanghai': 'CN', 'Guangzhou': 'CN', 'Shenzhen': 'CN', 'Hong Kong': 'CN',
    'Tokyo': 'JP', 'Kyoto': 'JP', 'Osaka': 'JP',
    'Bangkok': 'TH', 'Chiang Mai': 'TH', 'Phuket': 'TH',
    'Bali': 'ID', 'Jakarta': 'ID', 'Yogyakarta': 'ID',
    'Hanoi': 'VN', 'Ho Chi Minh City': 'VN', 'Da Nang': 'VN',
    'Singapore': 'SG',
    'Kuala Lumpur': 'MY', 'Penang': 'MY', 'Langkawi': 'MY',
    'Dubai': 'AE', 'Abu Dhabi': 'AE',
    'Istanbul': 'TR', 'Antalya': 'TR', 'Cappadocia': 'TR'
  };

  // Create Cities from JSON data
  const cities = [];
  for (const cityData of countryCityData.cities) {
    try {
      const countryCode = cityCountryMapping[cityData.name];
      const country = countries.find(c => c.code === countryCode);
      
      if (country) {
        const city = await City.create({
          name: cityData.name,
          status: cityData.status,
          code: cityData.code,
          slug: cityData.slug,
          countryCode: country.code,
          images: cityData.images
        } as any);
        cities.push(city);
        console.log(`✓ Created city: ${cityData.name}`);
      } else {
        console.log(`⚠ Skipped city: ${cityData.name} (no matching country for code: ${countryCode})`);
      }
    } catch (error:any) {
      console.error(`✗ Failed to create city: ${cityData.name}`, error.message);
    }
  }

  // Create Facility
  let facility;
  try {
    // Check if facility already exists
    const existingFacility = await Facility.findOne({ where: { code: 'FAC001' } });
    if (existingFacility) {
      facility = existingFacility;
      console.log('⚠ Facility already exists: Wellness Center');
    } else {
      facility = await Facility.create({
        name: 'Wellness Center',
        description: 'A place for wellness.',
        ctype: 'spa',
        subtype: 'luxury',
        address: '123 Main St',
        city: cities[0]?.name || 'Delhi',
        country: countries[0]?.name || 'India',
        latitude: 28.6139,
        longitude: 77.2090,
        status: 'active',
        userCode: user.code,
        pincode: '110001',
        contactNumber: '9876543210',
        images: ['https://s3.amazonaws.com/facilities/1_banner.jpg', 'https://s3.amazonaws.com/facilities/1_feature1.jpg'],
        code: 'FAC001',
        slug: 'wellness-center'
      } as any);
      console.log('✓ Created facility: Wellness Center');
    }
  } catch (error:any) {
    console.error('✗ Failed to create facility:', error.message);
    console.error('Validation details:', error.errors || error);
    
    // Try with minimal data as fallback
    try {
      const existingByName = await Facility.findOne({ where: { name: 'Wellness Center' } });
      if (existingByName) {
        facility = existingByName;
        console.log('⚠ Found existing facility by name: Wellness Center');
      } else {
        // Try creating with minimal required fields and empty arrays
        facility = await Facility.create({
          name: 'Wellness Center Basic',
          description: 'A place for wellness.',
          ctype: 'spa',
          subtype: 'luxury',
          address: '123 Main St',
          city: 'Delhi',
          country: 'India',
          latitude: 28.6139,
          longitude: 77.2090,
          status: 'active',
          userCode: user.code,
          pincode: '110001',
          contactNumber: '9876543210',
          images: [],
          code: 'FAC002',
          slug: 'wellness-center-basic'
        } as any);
        console.log('✓ Created minimal facility: Wellness Center Basic');
      }
    } catch (fallbackError: any) {
      console.error('✗ Facility fallback creation failed:', fallbackError.message);
      console.log('⚠ Continuing with dummy facility data...');
      // Create a minimal dummy facility object to continue execution
      facility = {
        id: 1,
        name: 'Dummy Facility',
        code: 'DUMMY001'
      };
    }
  }

  // Create ProgramStyles from JSON data
  console.log(`Loading ${facilityJsonData.ProgramStyles.length} program styles...`);
  const programStyles = [];
  for (const programData of facilityJsonData.ProgramStyles) {
    try {
      // Use the code from JSON data
      const code = programData['Program Code'];
      const slug = programData.Slug;
      
      // Check if program style already exists
      const existing = await ProgramStyle.findOne({ where: { code } });
      if (existing) {
        console.log(`⚠ Program style already exists: ${programData['Program Name']} (code: ${code})`);
        programStyles.push(existing);
        continue;
      }

      const style = await ProgramStyle.create({
        name: programData['Program Name'],
        description: programData.Description,
        status: programData.Status,
        code: code,
        slug: slug
      } as any);
      programStyles.push(style);
      console.log(`✓ Created program style: ${programData['Program Name']} (code: ${code})`);
    } catch (error:any) {
      console.error(`✗ Failed to create program style: ${programData['Program Name']}`, error.message);
      console.error('Full error:', error);
      
      // Try to find existing by name as fallback
      try {
        const existingByName = await ProgramStyle.findOne({ 
          where: { name: programData['Program Name'] } 
        });
        if (existingByName) {
          console.log(`⚠ Found existing program style by name: ${programData['Program Name']}`);
          programStyles.push(existingByName);
        }
      } catch (fallbackError: any) {
        console.error('Fallback lookup also failed:', fallbackError.message);
      }
    }
  }
  console.log(`Total program styles available: ${programStyles.length}`);

  // Create Program
  let program;
  try {
    program = await Program.create({
      name: 'Yoga Retreat',
      description: 'A relaxing yoga retreat program.',
      images: ['img1.jpg', 'img2.jpg'],
      programConfig: { level: 'beginner' },
      status: 'active',
      startDate: new Date('2025-08-01T10:00:00.000Z'),
      endDate: new Date('2025-08-07T10:00:00.000Z'),
      creatorCode: user.code,
      primaryFacilityCode: facility.code,
      programStyleCode: programStyles[0]?.code || null,
      code: 'PROG001',
      slug: 'yoga-retreat'
    } as any);
    console.log('✓ Created program: Yoga Retreat');
    if (!programStyles[0]) {
      console.log('⚠ Program created without program style (no program styles available)');
    }
  } catch (error:any) {
    console.error('✗ Failed to create program:', error.message);
    console.error('Full error:', error);
    return;
  }

  // Create Order first (before Payment)
  let order;
  try {
    order = await Order.create({
      userCode: user.code,
      status: 'completed',
      totalAmount: 1200.0
    } as any);
    console.log('✓ Created order');
  } catch (error:any) {
    console.error('✗ Failed to create order:', error.message);
    return;
  }

  // Create Payment (after Order)
  try {
    await Payment.create({
      transactionId: 'TXN001',
      amount: 1200.0,
      status: 'completed',
      paidAt: new Date('2025-08-01T12:00:00.000Z'),
      orderId: order.id
    } as any);
    console.log('✓ Created payment');
  } catch (error:any) {
    console.error('✗ Failed to create payment:', error.message);
  }

  // Create Booking
  try {
    await Booking.create({
      orderId: 'ORD123',
      programCode: program.code,
      userCode: user.code,
      status: 'confirmed',
      startDate: new Date('2025-08-01T10:00:00.000Z'),
      endDate: new Date('2025-08-07T10:00:00.000Z'),
      code: 'BOOK001'
    } as any);
    console.log('✓ Created booking');
  } catch (error:any) {
    console.error('✗ Failed to create booking:', error.message);
  }

  // Create Review
  try {
    await Review.create({
      programCode: program.code,
      userCode: user.code,
      rating: 5,
      comment: 'Excellent program!'
    } as any);
    console.log('✓ Created review');
  } catch (error:any) {
    console.error('✗ Failed to create review:', error.message);
  }

  // Create ProgramServiceMap
  try {
    await ProgramServiceMap.create({
      programCode: program.code,
      facilityAmenityId: 1,
      quantity: 1
    } as any);
    console.log('✓ Created program service map');
  } catch (error:any) {
    console.error('✗ Failed to create program service map:', error.message);
  }

  // Create Amenities from JSON data
  const amenities = [];
  for (const amenityData of facilityJsonData.Amenities) {
    try {
      // Check if amenity already exists
      const existingAmenity = await Amenity.findOne({ 
        where: { code: amenityData['Amenity Code'] } 
      });
      if (existingAmenity) {
        console.log(`⚠ Amenity already exists: ${amenityData['Amenity Name']} (code: ${amenityData['Amenity Code']})`);
        amenities.push(existingAmenity);
        continue;
      }

      const images = [
        amenityData.Images['banner image'],
        ...amenityData.Images['feature images'],
        ...amenityData.Images['otherImages']
      ];
      
      const amenity = await Amenity.create({
        name: amenityData['Amenity Name'],
        description: amenityData['Amenity Description'],
        category: amenityData.Category,
        status: 'active',
        images: images,
        code: amenityData['Amenity Code'],
        slug: amenityData.Slug
      } as any);
      amenities.push(amenity);
      console.log(`✓ Created amenity: ${amenityData['Amenity Name']} (code: ${amenityData['Amenity Code']})`);
    } catch (error:any) {
      console.error(`✗ Failed to create amenity: ${amenityData['Amenity Name']}`, error.message);
      
      // Try to find existing by name as fallback
      try {
        const existingByName = await Amenity.findOne({ 
          where: { name: amenityData['Amenity Name'] } 
        });
        if (existingByName) {
          console.log(`⚠ Found existing amenity by name: ${amenityData['Amenity Name']}`);
          amenities.push(existingByName);
        }
      } catch (fallbackError: any) {
        console.error('Amenity fallback lookup failed:', fallbackError.message);
      }
    }
  }

  // Create additional Facilities from JSON data
  console.log(`Creating additional facilities from ${facilityJsonData.Facilities.length} entries...`);
  const additionalFacilities = [];
  for (const facilityData of facilityJsonData.Facilities) {
    try {
      // Check if facility already exists
      const existingFacility = await Facility.findOne({ 
        where: { code: facilityData['Facility Code'] } 
      });
      if (existingFacility) {
        console.log(`⚠ Facility already exists: ${facilityData['Facility Name']} (code: ${facilityData['Facility Code']})`);
        additionalFacilities.push(existingFacility);
        continue;
      }

      // Find country and city for this facility
      const country = countries.find(c => c.code === facilityData['Country Code']);
      const city = cities.find(c => c.code === facilityData['City Code']);

      if (!country || !city) {
        console.log(`⚠ Skipped facility: ${facilityData['Facility Name']} (missing country or city)`);
        continue;
      }

      const images = [
        facilityData.Gallery['banner image'],
        ...facilityData.Gallery['feature images'],
        ...facilityData.Gallery['otherImages']
      ];

      const additionalFacility = await Facility.create({
        name: facilityData['Facility Name'],
        description: `${facilityData['Facility Type']} facility in ${facilityData.City}`,
        ctype: facilityData['Facility Type'].split(';')[0].toLowerCase(),
        subtype: 'luxury',
        address: `${facilityData['Facility Name']} Address`,
        city: facilityData.City,
        country: facilityData.Country,
        latitude: 0.0, // Default coordinates
        longitude: 0.0,
        status: 'active',
        userCode: users.facility.code,
        pincode: '000000',
        contactNumber: facilityData['Contact Number'],
        images: images,
        code: facilityData['Facility Code'],
        slug: facilityData.Slug
      } as any);
      
      additionalFacilities.push(additionalFacility);
      console.log(`✓ Created facility: ${facilityData['Facility Name']} (code: ${facilityData['Facility Code']})`);
    } catch (error:any) {
      console.error(`✗ Failed to create facility: ${facilityData['Facility Name']}`, error.message);
    }
  }
  console.log(`Total additional facilities available: ${additionalFacilities.length}`);

  // Map Facility Amenities (all required fields)
  try {
    if (amenities[0]) {
      await FacilityAmenity.create({
        facilityCode: facility.code,
        amenityCode: amenities[0].code,
        programCode: program.code,
        status: 'active',
        images: amenities[0].images,
        unit: 'session'
      } as any);
      console.log('✓ Created facility amenity mapping 1');
    }
  } catch (error:any) {
    console.error('✗ Failed to create facility amenity mapping 1', error.message);
  }

  try {
    if (amenities[1]) {
      await FacilityAmenity.create({
        facilityCode: facility.code,
        amenityCode: amenities[1].code,
        programCode: program.code,
        status: 'active',
        images: amenities[1].images,
        unit: 'session'
      } as any);
      console.log('✓ Created facility amenity mapping 2');
    }
  } catch (error:any) {
    console.error('✗ Failed to create facility amenity mapping 2', error.message);
  }

  // Map ProgramStyle Amenities from JSON data
  console.log(`Creating program style amenity mappings from ${facilityJsonData.ProgramStyleAmenities.length} entries...`);
  console.log(`Available program styles: ${programStyles.length}, Available amenities: ${amenities.length}`);
  
  let successfulMappings = 0;
  let skippedMappings = 0;
  let failedMappings = 0;

  for (const mapping of facilityJsonData.ProgramStyleAmenities) {
    try {
      const programStyleCode = mapping['Program Code'];
      const amenityCode = mapping['Amenity Code'];
      
      console.log(`Processing mapping: Program Code ${programStyleCode} -> Amenity Code ${amenityCode}`);
      
      // Find the program style and amenity by code
      const programStyle = programStyles.find(ps => ps.code === programStyleCode);
      const amenity = amenities.find(a => a.code === amenityCode);
      
      if (programStyle && amenity) {
        // Check if mapping already exists
        const existingMapping = await ProgramStyleAmenity.findOne({
          where: {
            programStyleCode: programStyle.code,
            amenityCode: amenity.code
          }
        });

        if (existingMapping) {
          console.log(`⚠ Mapping already exists: ${programStyle.name} -> ${amenity.name}`);
          successfulMappings++;
        } else {
          await ProgramStyleAmenity.create({
            programStyleCode: programStyle.code,
            amenityCode: amenity.code,
            status: 'active'
          } as any);
          console.log(`✓ Created program style amenity mapping: ${programStyle.name} -> ${amenity.name}`);
          successfulMappings++;
        }
      } else {
        console.log(`⚠ Skipped program style amenity mapping: ${programStyleCode} -> ${amenityCode} (missing entities)`);
        console.log(`  - Program style (${programStyleCode}): ${programStyle ? 'EXISTS' : 'MISSING'}`);
        console.log(`  - Amenity (${amenityCode}): ${amenity ? 'EXISTS' : 'MISSING'}`);
        skippedMappings++;
      }
    } catch (error:any) {
      console.error(`✗ Failed to create program style amenity mapping: ${mapping['Program Code']} -> ${mapping['Amenity Code']}`, error.message);
      console.error('Full error:', error);
      failedMappings++;
    }
  }

  console.log(`Program style amenity mapping summary:`);
  console.log(`  ✓ Successful: ${successfulMappings}`);
  console.log(`  ⚠ Skipped: ${skippedMappings}`);
  console.log(`  ✗ Failed: ${failedMappings}`);

  console.log('Dummy data seeded successfully.');
  process.exit(0);
}

seedDummyData().catch((err) => {
  console.error('Error seeding dummy data:', err);
  process.exit(1);
});
