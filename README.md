# Menu Tree System BE

## 🚀 Tech Stack

- **Framework**: Nest.js
- **Database**: MySQL
- **ORM**: Prisma
- **Testing**: Jest

## 📦 Dependencies

### Production Dependencies

- **@prisma/client** (^6.18.0): Auto-generated type-safe database client.

- **zod** (^4.1.12): Object schema validation library.

- **nest-winston** (^1.10.2): Multi-transport logging library.

- **dotenv** (^17.2.3): Prisma compatibility with typescript.

### Development Dependencies

- **@types/jest** (^30.0.0): TypeScript definitions for Jest.

- **@types/supertest** (^6.0.3): TypeScript definitions for supertest.

- **jest** (^30.0.4): JavaScript testing framework.

- **prisma** (^6.11.1): Database toolkit and ORM.

- **supertest** (^7.1.3): HTTP assertion testing library.

## 🛠️ Installation

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/RizkiLaksanaPutra/stk-technical-test-be.git
   cd menu-tree-system-be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   ```

   Replace `username`, `password`, and database credentials with your MySQL configuration.

4. **Database Setup**

   Initialize Prisma and create the database:

   ```bash
   npx prisma init
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the application**

   For development:

   ```bash
   npm run start:dev
   ```

   For production:

   ```bash
   npm run start:prod
   ```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

The testing setup includes:

- Unit tests with Jest
- Integration tests with Supertest

## 🐳 Run with Docker
### 🧩 Development Mode (with Hot Reload)
1. Make sure Docker and Docker Compose are installed.
2. From the project root, run:
```bash
docker compose -f docker-compose.dev.yml up --build
```
3. The backend will be available at http://localhost:3000 The MySQL database will be running at port 3307.
4. To stop the containers:
```bash
docker compose -f docker-compose.dev.yml down
```

### 🚀 Production Mode (Optimized Multi-Stage Build)
1. Build and run the production image:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
2. The backend API will be served at http://localhost:3000
3. To stop and remove containers:
```bash
docker compose -f docker-compose.prod.yml down
```

## 📚 API Documentation

*https://documenter.getpostman.com/view/44430374/2sB3WmUi9A*

## 🏗️ Project Structure

```
menu-tree-system-be/
├── src/
│   ├── common/
│   │   ├── common.module.ts      # Global module utls
│   │   ├── error.filter.ts       # Global exception filter
│   │   ├── prisma.service.ts     # PrismaClient service 
│   │   └── validation.service.ts # Initiate zod validation
│   │
│   ├── menu/
│   │   ├── menu.controller.ts    # REST API controller
│   │   ├── menu.module.ts        # Modul "menu"
│   │   ├── menu.service.ts       # Business logic "menu"
│   │   └── menu.validation.ts    # Zod schema validation
│   │
│   ├── model/
│   │   ├── menu.model.ts         # Type/DTO for Menu
│   │   └── web.model.ts          # Type/DTO for web response
│   │
│   ├── app.module.ts             # Root module NestJS
│   └── main.ts                   # Entrypoint
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── tests/                        # Unit test
├── .env                          # Environment variables
└── prisma.config.ts              # Prisma client configurations
└── openapi.yaml                  # API Documentation
└── package.json
```
