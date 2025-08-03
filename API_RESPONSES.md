# API Response Documentation

## Authentication

This API uses JWT (JSON Web Token) authentication. Most endpoints require authentication with a valid JWT token.

### Authentication Endpoints

#### Register (`POST /auth/register`)
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "code": "usr123abc"
  }
}
```

#### Login (`POST /auth/login`)
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "code": "usr123abc"
  }
}
```

#### Google Login (`POST /auth/google-login`)
**Request Body:**
```json
{
  "tokenId": "google-id-token-here"
}
```

#### OTP Authentication
**Send OTP (`POST /auth/send-otp`):**
```json
{
  "phone": "+1234567890"
}
```

**Verify OTP (`POST /auth/verify-otp`):**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### Get Profile (`GET /auth/profile`)
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "code": "usr123abc",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Refresh Token (`POST /auth/refresh-token`)
**Request Body:**
```json
{
  "refreshToken": "existing-token-here"
}
```

#### Logout (`POST /auth/logout`)
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Using Authentication

Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles and Permissions

- **user**: Basic user role, can manage own data
- **facility**: Can manage facilities and programs
- **admin**: Full access to all endpoints

### Protected Endpoints Summary

- **Admin only**: `/admin/*`, `/programs/:code/approve`, `/orders` (get all)
- **Facility/Admin**: `/facilities` (create/update), `/programs` (create)
- **Authenticated users**: `/bookings/*`, `/orders/*` (user-specific), `/reviews` (create), `/users/*/update`
- **Public**: Most GET endpoints for browsing data

## Code-Based Relationships System

This API uses a code-based relationship system instead of numeric IDs for better security and consistency:

### Entity Codes:
- **User codes**: `usr` + 6 hex characters (e.g., `usr123abc`)
- **Program codes**: `pr` + name prefix + random + timestamp (e.g., `pryo4f23`)
- **Facility codes**: Format varies (e.g., `fac456ghi`)
- **Program Style codes**: Format varies (e.g., `ps001abc`)
- **Amenity codes**: Format varies (e.g., `am789def`)
- **Country codes**: ISO-style codes (e.g., `IN`, `US`)
- **City codes**: Format varies (e.g., `dl001`, `ny002`)

### Key Field Mappings:
- `userId` → `userCode`
- `programId` → `programCode`
- `facilityId` → `facilityCode`
- `amenityId` → `amenityCode`
- `programStyleId` → `programStyleCode`
- `countryId` → `countryCode`
- `creatorId` → `creatorCode`
- `primaryFacilityId` → `primaryFacilityCode`

### Route Changes:
- `/users/:userCode` instead of `/users/:id`
- `/bookings/user/:userCode` instead of `/bookings/user/:userId`
- `/orders/user/:userCode` instead of `/orders/user/:userId`
- `/reviews/:programCode` instead of `/reviews/:programId`
- `/program-services/:programCode` instead of `/program-services/:programId`
- `/program-style-amenities/:programStyleCode` instead of `/program-style-amenities/:programStyleId`
- `/facility-amenities/:facilityCode` instead of `/facility-amenities/:facilityId`
- `/locations/countries/:countryCode/cities` instead of `/locations/countries/:countryId/cities`

## Program Endpoints

### Create Program (`POST /programs`)
**Request Body:**
```json
{
  "name": "Yoga Retreat",
  "description": "A relaxing yoga retreat program.",
  "images": ["img1.jpg", "img2.jpg"],
  "programConfig": { "level": "beginner" },
  "programStyleCode": "ps001abc",
  "status": "active",
  "startDate": "2025-08-01T10:00:00.000Z",
  "endDate": "2025-08-07T10:00:00.000Z",
  "creatorCode": "usr123def",
  "primaryFacilityCode": "fac456ghi"
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "name": "Yoga Retreat",
  "code": "pryo4f23",
  "description": "A relaxing yoga retreat program.",
  "approved": true,
  "startDate": "2025-08-01T10:00:00.000Z",
  "endDate": "2025-08-07T10:00:00.000Z",
  "price": 1200.0,
  "images": ["img1.jpg", "img2.jpg"],
  "programConfig": { "level": "beginner" },
  "slug": "yoga-retreat",
  "programStyleCode": "ps001abc",
  "status": "active",
  "creatorCode": "usr123def",
  "primaryFacilityCode": "fac456ghi",
  "programStyle": {
    "id": 1,
    "name": "Wellness",
    "code": "ps001abc",
    "description": "Wellness style",
    "status": "active"
  },
  "creator": {
    "id": 2,
    "email": "user@example.com",
    "code": "usr123def",
    "role": "admin"
  },
  "facility": {
    "id": 1,
    "name": "Wellness Center",
    "description": "A place for wellness.",
    "ctype": "spa",
    "subtype": "luxury",
    "address": "123 Main St, Springfield",
    "city": "Springfield",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "active",
    "userCode": "usr123def"
  },
  "programAmenities": [
    {
      "id": 10,
      "name": "Yoga Mat",
      "description": "High quality yoga mat.",
      "category": "yoga",
      "status": "active",
      "images": ["mat1.jpg", "mat2.jpg"],
      "unit": "session",
      "capacity": 20
    }
  ],
  "createdAt": "2025-07-27T09:00:00.000Z",
  "updatedAt": "2025-07-27T09:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Failed to create program" }
```

### Get Programs (`GET /programs`)
**Query Parameters:**
- `city` (optional)
- `style` (optional)

**Success Response (200):**
```json
[
  {
  "programStyle": {
    "id": 1,
    "name": "Wellness",
    "description": "Wellness style",
    "status": "active"
  },
    "name": "string",
    "description": "string",
    "images": ["string"],
    "programConfig": { "level": "string" },
    "slug": "string",
  "programStyle": {
    "id": "number",
    "name": "string",
    "description": "string",
    "status": "string"
  },
    "status": "string",
    "startDate": "ISODateString",
    "endDate": "ISODateString",
    "creatorId": "number",
    "primaryFacilityId": "number",
    "creator": {
      "id": "number",
      "email": "string",
  "programStyle": {
    "id": "number",
    "name": "string",
    "description": "string",
    "status": "string"
  },
    },
    "facility": {
      "id": "number",
      "name": "string",
      "description": "string",
      "ctype": "string",
      "subtype": "string",
      "address": "string",
      "city": "string",
      "country": "string",
      "latitude": "number",
      "longitude": "number",
      "status": "string",
      "userId": "number"
    }
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch programs" }
```

### Approve Program (`POST /programs/:code/approve`)
**Success Response (200):**
```json
{
  "message": "Program approved",
  "program": {
    "id": "number",
    "name": "string",
    "description": "string",
    "images": ["string (S3 URL)"],
    "programConfig": { "level": "string" },
    "slug": "string",
    "status": "string",
    "startDate": "ISODateString",
  "programStyle": {
    "id": 1,
    "name": "Wellness",
    "description": "Wellness style",
    "status": "active"
  },
    "creatorId": "number",
    "primaryFacilityId": "number",
    "creator": {
      "id": "number",
      "email": "string",
      "role": "admin" | "user" | "facility"
    },
    "facility": {
      "id": "number",
      "name": "string",
      "description": "string",
      "ctype": "string",
      "subtype": "string",
      "address": "string",
      "city": "string",
      "country": "string",
      "latitude": "number",
      "longitude": "number",
      "status": "string",
      "userId": "number"
    }
  }
}
```
**Error Response (404):**
```json
{ "error": "Program not found" }
```
**Error Response (400):**
```json
{ "error": "Approval failed" }
```

### Get Program Details (`GET /programs/:code`)
**Success Response (200):**
```json
{
  "id": 1,
  "name": "Yoga Retreat",
  "description": "A relaxing yoga retreat program.",
  "images": ["img1.jpg", "img2.jpg"],
  "programConfig": { "level": "beginner" },
  "slug": "yoga-retreat",
  "programStyle": {
    "id": 1,
    "name": "Wellness",
    "description": "Wellness style",
    "status": "active"
  },
  "status": "active",
  "startDate": "2025-08-01T10:00:00.000Z",
  "endDate": "2025-08-07T10:00:00.000Z",
  "duration": 6,
  "location": "123 Main St, Springfield",
  "price": 1200.0,
  "creatorId": 2,
  "primaryFacilityId": 1,
  "createdAt": "2025-07-27T09:00:00.000Z",
  "updatedAt": "2025-07-27T09:00:00.000Z",
  "creator": {
    "id": 2,
    "email": "user@example.com",
    "role": "user"
  },
  "facility": {
    "id": 1,
    "name": "Wellness Center",
    "description": "A place for wellness.",
    "ctype": "spa",
    "subtype": "luxury",
    "address": "123 Main St, Springfield",
    "city": "Springfield",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "active",
    "userCode": "usr123def"
  },
  "amenities": [
    {
      "id": 10,
      "name": "Yoga Mat",
      "description": "High quality yoga mat.",
      "category": "yoga",
      "status": "active",
      "images": ["mat1.jpg", "mat2.jpg"],
      "unit": "session",
      "capacity": 20
    },
    {
      "id": 11,
      "name": "Spa Access",
      "description": "Full spa access.",
      "category": "spa",
      "status": "active",
      "images": ["spa1.jpg"],
      "unit": "day",
      "capacity": 10
    }
  ]
}
```
**Error Response (404):**
```json
{ "error": "Program not found" }
```
---

## User Dashboard Endpoint

### Get User Dashboard (`GET /user/dashboard`)
**Success Response (200):**
```json
{
  "bookings": {
    "page": 1,
    "pageSize": 10,
    "total": 2,
    "data": [
      {
        "id": "number",
        "orderId": "ORD123",
        "programId": "number",
        "userId": "number",
        "status": "confirmed",
        "startDate": "ISODateString",
        "endDate": "ISODateString",
        "createdAt": "ISODateString",
        "updatedAt": "ISODateString",
        "code": "string"
      }
    ]
  },
  "reviews": [
    {
      "id": "number",
      "programId": "number",
      "userId": "number",
      "rating": "number",
      "comment": "string",
      "program": {
        "id": "number",
        "name": "string"
      },
      "user": {
        "id": "number",
        "email": "string"
      }
    }
  ]
}
```
**Error Response (500):**
```json
{ "error": "Failed to fetch dashboard" }
```

---

## Admin Endpoints

### Get All Programs (`GET /admin/programs`)
**Success Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "images": ["string (S3 URL)"],
    "programConfig": { "level": "string" },
    "slug": "string",
    "status": "string",
    "startDate": "ISODateString",
    "endDate": "ISODateString",
    "creatorId": "number",
    "primaryFacilityId": "number",
    "creator": {
      "id": "number",
      "email": "string",
      "role": "admin" | "user" | "facility"
    },
    "facility": {
      "id": "number",
      "name": "string",
      "description": "string",
      "ctype": "string",
      "subtype": "string",
      "address": "string",
      "city": "string",
      "country": "string",
      "latitude": "number",
      "longitude": "number",
      "status": "string",
      "userId": "number"
    }
  }
]
```

### Get All Bookings (`GET /admin/bookings`)
**Success Response (200):**
```json
[
  {
    "id": "number",
    "userId": "number",
    "programId": "number",
    "status": "string",
    "startDate": "ISODateString",
    "endDate": "ISODateString",
    "createdAt": "ISODateString",
    "updatedAt": "ISODateString"
  }
]
```

### Delete Program (`DELETE /admin/programs/:code`)
**Success Response (200):**
```json
{ "message": "Program deleted" }
```
**Error Response (404):**
```json
{ "error": "Program not found" }
```

---

## Amenity Endpoints

### Create Amenity (`POST /amenities`)
**Request Body:**
```json
{
  "name": "Swimming Pool",
  "description": "Swimming Pool for wellness and rejuvenation.",
  "category": "wellness",
  "status": "active",
  "code": "AMEN001",
  "slug": "swimming-pool",
  "images": [
    "https://s3.amazonaws.com/facilities/1_banner.jpg",
    "https://s3.amazonaws.com/facilities/1_feature1.jpg"
  ]
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "name": "Swimming Pool",
  "description": "Swimming Pool for wellness and rejuvenation.",
  "category": "wellness",
  "status": "active",
  "code": "AMEN001",
  "slug": "swimming-pool",
  "images": [
    "https://s3.amazonaws.com/facilities/1_banner.jpg",
    "https://s3.amazonaws.com/facilities/1_feature1.jpg"
  ],
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Failed to create amenity" }
```

### Get All Amenities (`GET /amenities`)
**Success Response (200):**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 1,
  "data": [
    {
      "id": 1,
      "name": "Swimming Pool",
      "description": "Swimming Pool for wellness and rejuvenation.",
      "category": "wellness",
      "status": "active",
      "code": "AMEN001",
      "slug": "swimming-pool",
      "images": [
        "https://s3.amazonaws.com/facilities/1_banner.jpg",
        "https://s3.amazonaws.com/facilities/1_feature1.jpg"
      ],
      "createdAt": "2025-08-03T00:00:00.000Z",
      "updatedAt": "2025-08-03T00:00:00.000Z"
    }
  ]
}
```

### Get Amenity by Code (`GET /amenities/:code`)
**Success Response (200):**
```json
{
  "id": 1,
  "name": "Swimming Pool",
  "description": "Swimming Pool for wellness and rejuvenation.",
  "category": "wellness",
  "status": "active",
  "code": "AMEN001",
  "slug": "swimming-pool",
  "images": [
    "https://s3.amazonaws.com/facilities/1_banner.jpg",
    "https://s3.amazonaws.com/facilities/1_feature1.jpg"
  ],
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (404):**
```json
{ "error": "Amenity not found" }
```
**Error Response (500):**
```json
{ "error": "Failed to fetch amenity" }
```

---

## Location Endpoints

### Get Countries (`GET /locations/countries`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "India",
    "status": "active",
    "code": "IN",
    "slug": "india",
    "images": [
      "https://s3.amazonaws.com/geo/countries/in_1.jpg"
    ],
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "cities": [
      {
        "id": 1,
        "name": "Delhi",
        "status": "active",
        "code": "DEL",
        "slug": "delhi",
        "countryId": 1,
        "images": [
          "https://s3.amazonaws.com/geo/cities/delhi_1.jpg"
        ],
        "createdAt": "2025-08-03T00:00:00.000Z",
        "updatedAt": "2025-08-03T00:00:00.000Z"
      }
    ]
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch countries" }
```

### Get Cities by Country (`GET /locations/cities/:countryId`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Delhi",
    "status": "active",
    "code": "DEL",
    "slug": "delhi",
    "countryId": 1,
    "images": [
      "https://s3.amazonaws.com/geo/cities/delhi_1.jpg"
    ],
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z"
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch cities" }
```

### Get Countries with Cities (`GET /locations/countries-cities`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "India",
    "status": "active",
    "code": "IN",
    "slug": "india",
    "images": [
      "https://s3.amazonaws.com/geo/countries/in_1.jpg"
    ],
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "cities": [
      {
        "id": 1,
        "name": "Delhi",
        "status": "active",
        "code": "DEL",
        "slug": "delhi",
        "countryId": 1,
        "images": [
          "https://s3.amazonaws.com/geo/cities/delhi_1.jpg"
        ],
        "createdAt": "2025-08-03T00:00:00.000Z",
        "updatedAt": "2025-08-03T00:00:00.000Z"
      }
    ]
  }
]
```

### Get Programs by City (`GET /locations/programs/city/:city`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Yoga Retreat",
    "description": "A relaxing yoga retreat program.",
    "images": ["img1.jpg", "img2.jpg"],
    "programConfig": { "level": "beginner" },
    "slug": "yoga-retreat",
    "status": "active",
    "startDate": "2025-08-01T10:00:00.000Z",
    "endDate": "2025-08-07T10:00:00.000Z",
    "creatorId": 2,
    "primaryFacilityId": 1,
    "facility": {
      "id": 1,
      "name": "Wellness Center",
      "city": "Delhi",
      "country": "India"
    }
  }
]
```

### Get Programs by Style (`GET /locations/programs/style/:style`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Yoga Retreat",
    "description": "A relaxing yoga retreat program.",
    "images": ["img1.jpg", "img2.jpg"],
    "programConfig": { "level": "beginner" },
    "slug": "yoga-retreat",
    "status": "active",
    "startDate": "2025-08-01T10:00:00.000Z",
    "endDate": "2025-08-07T10:00:00.000Z",
    "creatorId": 2,
    "primaryFacilityId": 1,
    "programStyle": {
      "id": 1,
      "name": "Wellness",
      "description": "Wellness style",
      "status": "active"
    }
  }
]
```

---

## Facility Amenity Endpoints

### Add Facility Amenity (`POST /facility-amenity`)
**Success Response (201):**
```json
{
  "id": "number",
  "facilityId": "number",
  "amenityId": "number",
  "basePrice": "number",
  "unit": "string",
  "capacity": "number",
  "status": "string"
}
```
**Error Response (400):**
```json
{ "error": "Failed to add facility amenity" }
```

### Get Facility Amenities (`GET /facility-amenity/:facilityId`)
**Success Response (200):**
```json
[
  {
    "id": "number",
    "facilityId": "number",
    "amenityId": "number",
    "basePrice": "number",
    "unit": "string",
    "capacity": "number",
    "status": "string"
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch facility amenities" }
```

---

## Program Style Amenity Endpoints

### Add Program Style Amenity (`POST /program-style-amenities`)
**Request Body:**
```json
{
  "programStyleId": 1,
  "amenityId": 2,
  "status": "active"
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "programStyleId": 1,
  "amenityId": 2,
  "status": "active",
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Failed to add program style amenity" }
```

### Get Program Style Amenities (`GET /program-style-amenities/:programStyleId`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "programStyleId": 1,
    "amenityId": 2,
    "status": "active",
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "programStyle": {
      "id": 1,
      "name": "Couples Longevity Retreat",
      "description": "Couples Longevity Retreat program",
      "status": "active",
      "code": "STYLE001",
      "slug": "couples-longevity-retreat"
    },
    "amenity": {
      "id": 2,
      "name": "Spa",
      "description": "Spa for wellness and rejuvenation.",
      "category": "wellness",
      "status": "active",
      "code": "AMEN002",
      "slug": "spa",
      "images": [
        "https://s3.amazonaws.com/facilities/1_banner.jpg",
        "https://s3.amazonaws.com/facilities/1_feature1.jpg"
      ]
    }
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch program style amenities" }
```

---

## Program Style Endpoints

### Get All Program Styles (`GET /program-styles`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Couples Longevity Retreat",
    "description": "Couples Longevity Retreat program",
    "status": "active",
    "code": "STYLE001",
    "slug": "couples-longevity-retreat",
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Executive Biohacking Reset",
    "description": "Executive Biohacking Reset program",
    "status": "active",
    "code": "STYLE002",
    "slug": "executive-biohacking-reset",
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z"
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch program styles" }
```

### Get Program Style by Code (`GET /program-styles/:code`)
**Success Response (200):**
```json
{
  "id": 1,
  "name": "Couples Longevity Retreat",
  "description": "Couples Longevity Retreat program",
  "status": "active",
  "code": "STYLE001",
  "slug": "couples-longevity-retreat",
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (404):**
```json
{ "error": "Program style not found" }
```
**Error Response (500):**
```json
{ "error": "Failed to fetch program style" }
```

---

## Auth Endpoints

### Send OTP (`POST /auth/send-otp`)
**Success Response (200):**
```json
{ "message": "OTP sent" }
```

### Verify OTP (`POST /auth/verify-otp`)
**Success Response (200):**
```json
{ "accessToken": "string" }
```
**Error Response (400):**
```json
{ "error": "Invalid OTP" }
```

### Google Login (`POST /auth/google-login`)
**Success Response (200):**
```json
{ "accessToken": "string" }
```
**Error Response (400):**
```json
{ "error": "Invalid Google token payload" }
```
**Error Response (400):**
```json
{ "error": "Google token verification failed" }
```

---

## Review Endpoints

### Add Review (`POST /reviews`)
**Success Response (201):**
```json
{ /* Review object */ }
```
**Error Response (400):**
```json
{ "error": "Failed to submit review" }
```

### Get Program Reviews (`GET /reviews/:programId`)
**Success Response (200):**
```json
[
  {
    "id": "number",
    "programId": "number",
    "userId": "number",
    "rating": "number",
    "comment": "string",
    "program": {
      "id": "number",
      "name": "string"
    },
    "user": {
      "id": "number",
      "email": "string"
    }
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch reviews" }
```

---

## Facility Endpoints

### Create Facility (`POST /facilities`)
**Request Body:**
```json
{
  "name": "Wellness Center",
  "description": "A place for wellness.",
  "ctype": "spa",
  "subtype": "luxury",
  "address": "123 Main St",
  "city": "Delhi",
  "country": "India",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "status": "active",
  "pincode": "110001",
  "contactNumber": "9876543210",
  "code": "FAC001",
  "slug": "wellness-center",
  "images": [
    "https://s3.amazonaws.com/facilities/1_banner.jpg",
    "https://s3.amazonaws.com/facilities/1_feature1.jpg"
  ]
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "name": "Wellness Center",
  "description": "A place for wellness.",
  "ctype": "spa",
  "subtype": "luxury",
  "address": "123 Main St",
  "city": "Delhi",
  "country": "India",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "status": "active",
  "pincode": "110001",
  "contactNumber": "9876543210",
  "code": "FAC001",
  "slug": "wellness-center",
  "userId": 1,
  "images": [
    "https://s3.amazonaws.com/facilities/1_banner.jpg",
    "https://s3.amazonaws.com/facilities/1_feature1.jpg"
  ],
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Failed to create facility" }
```

### Get All Facilities (`GET /facilities`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Wellness Center",
    "description": "A place for wellness.",
    "ctype": "spa",
    "subtype": "luxury",
    "address": "123 Main St",
    "city": "Delhi",
    "country": "India",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "status": "active",
    "pincode": "110001",
    "contactNumber": "9876543210",
    "code": "FAC001",
    "slug": "wellness-center",
    "userId": 1,
    "images": [
      "https://s3.amazonaws.com/facilities/1_banner.jpg",
      "https://s3.amazonaws.com/facilities/1_feature1.jpg"
    ],
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "facility"
    }
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch facilities" }
```

### Get Facility by Code (`GET /facilities/:code`)
**Success Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "ctype": "string",
  "subtype": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "latitude": "number",
  "longitude": "number",
  "status": "string",
  "userId": "number"
}
```
**Error Response (404):**
```json
{ "error": "Facility not found" }
```
**Error Response (500):**
```json
{ "error": "Failed to fetch facility" }
```

### Update Facility (`PUT /facilities/:code`)
**Success Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "ctype": "string",
  "subtype": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "latitude": "number",
  "longitude": "number",
  "status": "string",
  "userId": "number"
}
```
**Error Response (400):**
```json
{ "error": "Failed to update facility" }
```

---

## Booking Endpoints

### Book Program (`POST /bookings`)
**Request Body:**
```json
{
  "orderId": "ORD123",
  "programId": 1,
  "userId": 2,
  "startDate": "2025-07-27T10:00:00.000Z",
  "endDate": "2025-07-30T10:00:00.000Z",
  "code": "bkprus12345"
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "orderId": "ORD123",
  "programId": 1,
  "userId": 2,
  "status": "confirmed",
  "startDate": "2025-07-27T10:00:00.000Z",
  "endDate": "2025-07-30T10:00:00.000Z",
  "createdAt": "2025-07-27T09:00:00.000Z",
  "updatedAt": "2025-07-27T09:00:00.000Z",
  "code": "bkprus12345"
}
```
**Error Response (400):**
```json
{ "error": "Missing required field: orderId" }
```
**Error Response (400):**
```json
{ "error": "Booking failed" }
```

### Get Booking by Code (`GET /bookings/:code`)
**Success Response (200):**
```json
{
  "id": 1,
  "orderId": "ORD123",
  "programId": 1,
  "userId": 2,
  "status": "confirmed",
  "startDate": "2025-07-27T10:00:00.000Z",
  "endDate": "2025-07-30T10:00:00.000Z",
  "createdAt": "2025-07-27T09:00:00.000Z",
  "updatedAt": "2025-07-27T09:00:00.000Z",
  "code": "bkprus12345"
}
```
**Error Response (404):**
```json
{ "error": "Booking not found" }
```
**Error Response (500):**
```json
{ "error": "Failed to fetch booking" }
```

### Get User Bookings (`GET /bookings/user/:userId`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "orderId": "ORD123",
    "programId": 1,
    "userCode": "usr123def",
    "status": "confirmed",
    "startDate": "2025-07-27T10:00:00.000Z",
    "endDate": "2025-07-30T10:00:00.000Z",
    "createdAt": "2025-07-27T09:00:00.000Z",
    "updatedAt": "2025-07-27T09:00:00.000Z",
    "code": "bkprus12345"
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch bookings" }
```
---

## Order Endpoints

### Create Order (`POST /orders`)
**Request Body:**
```json
{
  "userId": 1,
  "status": "pending",
  "totalAmount": 1200.0
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "status": "pending",
  "totalAmount": 1200.0,
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Missing required field: userId" }
```

### Get All Orders (`GET /orders`)
**Query Parameters:**
- `page` (optional, default: 1)
- `pageSize` (optional, default: 10)

**Success Response (200):**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 1,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "status": "completed",
      "totalAmount": 1200.0,
      "createdAt": "2025-08-03T00:00:00.000Z",
      "updatedAt": "2025-08-03T00:00:00.000Z",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "role": "user"
      }
    }
  ]
}
```

### Get Order by ID (`GET /orders/:id`)
**Success Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "status": "completed",
  "totalAmount": 1200.0,
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```
**Error Response (404):**
```json
{ "error": "Order not found" }
```

### Get User Orders (`GET /orders/user/:userId`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "status": "completed",
    "totalAmount": 1200.0,
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
]
```

---

## Payment Endpoints

### Create Payment (`POST /payments`)
**Request Body:**
```json
{
  "transactionId": "TXN123456",
  "amount": 1200.0,
  "status": "completed",
  "paidAt": "2025-08-03T12:00:00.000Z",
  "orderId": 1
}
```
**Success Response (201):**
```json
{
  "id": 1,
  "transactionId": "TXN123456",
  "amount": 1200.0,
  "status": "completed",
  "paidAt": "2025-08-03T12:00:00.000Z",
  "orderId": 1,
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z"
}
```
**Error Response (400):**
```json
{ "error": "Missing required field: transactionId" }
```

### Get All Payments (`GET /payments`)
**Query Parameters:**
- `page` (optional, default: 1)
- `pageSize` (optional, default: 10)

**Success Response (200):**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 1,
  "data": [
    {
      "id": 1,
      "transactionId": "TXN123456",
      "amount": 1200.0,
      "status": "completed",
      "paidAt": "2025-08-03T12:00:00.000Z",
      "orderId": 1,
      "createdAt": "2025-08-03T00:00:00.000Z",
      "updatedAt": "2025-08-03T00:00:00.000Z",
      "order": {
        "id": 1,
        "userId": 1,
        "status": "completed",
        "totalAmount": 1200.0
      }
    }
  ]
}
```

### Get Payment by ID (`GET /payments/:id`)
**Success Response (200):**
```json
{
  "id": 1,
  "transactionId": "TXN123456",
  "amount": 1200.0,
  "status": "completed",
  "paidAt": "2025-08-03T12:00:00.000Z",
  "orderId": 1,
  "createdAt": "2025-08-03T00:00:00.000Z",
  "updatedAt": "2025-08-03T00:00:00.000Z",
  "order": {
    "id": 1,
    "userId": 1,
    "status": "completed",
    "totalAmount": 1200.0
  }
}
```
**Error Response (404):**
```json
{ "error": "Payment not found" }
```

### Get Order Payments (`GET /payments/order/:orderId`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "transactionId": "TXN123456",
    "amount": 1200.0,
    "status": "completed",
    "paidAt": "2025-08-03T12:00:00.000Z",
    "orderId": 1,
    "createdAt": "2025-08-03T00:00:00.000Z",
    "updatedAt": "2025-08-03T00:00:00.000Z",
    "order": {
      "id": 1,
      "userId": 1,
      "status": "completed",
      "totalAmount": 1200.0
    }
  }
]
```

---

## Program Service Endpoints

### Map Service to Program (`POST /program-service`)
**Success Response (201):**
```json
{
  "id": "number",
  "programId": "number",
  "facilityAmenityId": "number",
  "quantity": "number"
}
```
**Error Response (400):**
```json
{ "error": "Mapping failed" }
```

### Get Services for Program (`GET /program-service/:programId`)
**Success Response (200):**
```json
[
  {
    "id": "number",
    "programId": "number",
    "facilityAmenityId": "number",
    "quantity": "number"
  }
]
```
**Error Response (500):**
```json
{ "error": "Failed to fetch services" }
```

---

## Home Endpoint

### Get Homepage Sections (`GET /home`)
**Success Response (200):**
```json
{
  "recommended": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "images": ["string (S3 URL)"],
      "programConfig": { "level": "string" },
      "slug": "string",
      "status": "string",
      "startDate": "ISODateString",
      "endDate": "ISODateString",
      "creatorId": "number",
      "primaryFacilityId": "number",
      "creator": {
        "id": "number",
        "email": "string",
        "role": "admin" | "user" | "facility"
      },
      "facility": {
        "id": "number",
        "name": "string",
        "description": "string",
        "ctype": "string",
        "subtype": "string",
        "address": "string",
        "city": "string",
        "country": "string",
        "latitude": "number",
        "longitude": "number",
        "status": "string",
        "userId": "number"
      }
    }
  ],
  "newest": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "images": ["string (S3 URL)"],
      "programConfig": { "level": "string" },
      "slug": "string",
      "status": "string",
      "startDate": "ISODateString",
      "endDate": "ISODateString",
      "creatorId": "number",
      "primaryFacilityId": "number",
      "creator": {
        "id": "number",
        "email": "string",
        "role": "admin" | "user" | "facility"
      },
      "facility": {
        "id": "number",
        "name": "string",
        "description": "string",
        "ctype": "string",
        "subtype": "string",
        "address": "string",
        "city": "string",
        "country": "string",
        "latitude": "number",
        "longitude": "number",
        "status": "string",
        "userId": "number"
      }
    }
  ]
}
```
**Error Response (500):**
```json
{ "error": "Failed to load homepage programs" }
```

## User Endpoints

### Get User by Code (`GET /users/:userCode`)
**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "code": "usr123abc",
  "role": "user",
  "createdAt": "2025-07-27T09:00:00.000Z",
  "updatedAt": "2025-07-27T09:00:00.000Z"
}
```

### Update User (`PUT /users/:userCode`)
**Request Body:**
```json
{
  "email": "newemail@example.com",
  "role": "admin"
}
```
**Success Response (200):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "code": "usr123abc",
  "role": "admin",
  "updatedAt": "2025-07-27T10:00:00.000Z"
}
```

## Booking Endpoints

### Create Booking (`POST /bookings`)
**Request Body:**
```json
{
  "orderId": "ORD123",
  "programCode": "pryo4f23",
  "userCode": "usr123abc",
  "startDate": "2025-08-01T10:00:00.000Z",
  "endDate": "2025-08-07T10:00:00.000Z",
  "status": "confirmed",
  "code": "book789xyz"
}
```

### Get User Bookings (`GET /bookings/user/:userCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "orderId": "ORD123",
    "programCode": "pryo4f23",
    "userCode": "usr123abc",
    "status": "confirmed",
    "code": "book789xyz",
    "program": {
      "name": "Yoga Retreat",
      "code": "pryo4f23"
    },
    "user": {
      "email": "user@example.com",
      "code": "usr123abc"
    }
  }
]
```

## Order Endpoints

### Get User Orders (`GET /orders/user/:userCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "userCode": "usr123abc",
    "status": "completed",
    "totalAmount": 1200.0,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "code": "usr123abc",
      "role": "user"
    }
  }
]
```

## Review Endpoints

### Get Program Reviews (`GET /reviews/:programCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "programCode": "pryo4f23",
    "userCode": "usr123abc",
    "rating": 5,
    "comment": "Amazing experience!",
    "user": {
      "email": "user@example.com",
      "code": "usr123abc"
    },
    "program": {
      "name": "Yoga Retreat",
      "code": "pryo4f23"
    }
  }
]
```

## Location Endpoints

### Get Cities by Country (`GET /locations/countries/:countryCode/cities`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Delhi",
    "code": "dl001",
    "countryCode": "IN",
    "status": "active",
    "country": {
      "name": "India",
      "code": "IN"
    }
  }
]
```

## Facility Amenity Endpoints

### Get Facility Amenities (`GET /facility-amenities/:facilityCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "facilityCode": "fac456ghi",
    "amenityCode": "am789def",
    "programCode": "pryo4f23",
    "status": "active",
    "images": ["amenity1.jpg"],
    "unit": "session",
    "facility": {
      "name": "Wellness Center",
      "code": "fac456ghi"
    },
    "amenity": {
      "name": "Yoga Mat",
      "code": "am789def"
    }
  }
]
```

## Program Service Endpoints

### Get Program Services (`GET /program-services/:programCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "programCode": "pryo4f23",
    "facilityAmenityId": 1,
    "quantity": 20,
    "program": {
      "name": "Yoga Retreat",
      "code": "pryo4f23"
    },
    "facilityAmenity": {
      "id": 1,
      "status": "active"
    }
  }
]
```

## Program Style Amenity Endpoints

### Get Program Style Amenities (`GET /program-style-amenities/:programStyleCode`)
**Success Response (200):**
```json
[
  {
    "id": 1,
    "programStyleCode": "ps001abc",
    "amenityCode": "am789def",
    "status": "active",
    "programStyle": {
      "name": "Wellness",
      "code": "ps001abc"
    },
    "amenity": {
      "name": "Yoga Mat",
      "code": "am789def"
    }
  }
]
```
