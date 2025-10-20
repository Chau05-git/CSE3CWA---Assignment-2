# CRUD API Documentation

## Overview
Full CRUD (Create, Read, Update, Delete) API implementation using Next.js 15, Sequelize ORM, and SQLite database.

## Database Setup
- **ORM**: Sequelize 6.37.7
- **Database**: SQLite (file-based: `database.sqlite`)
- **Model**: Item (id, name, description, timestamps)

## API Endpoints

### 1. Create Item
**POST** `/api/items`

**Request Body:**
```json
{
  "name": "Item Name",
  "description": "Optional description"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Optional description",
  "createdAt": "2025-10-20T01:07:00.018Z",
  "updatedAt": "2025-10-20T01:07:00.020Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:80/api/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"Laptop","description":"Work laptop"}'
```

---

### 2. List All Items
**GET** `/api/items`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "Work laptop",
    "createdAt": "2025-10-20T01:07:00.018Z",
    "updatedAt": "2025-10-20T01:07:00.020Z"
  }
]
```

**cURL Example:**
```bash
curl http://localhost:80/api/items
```

---

### 3. Get Single Item
**GET** `/api/items/:id`

**Response (200):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Work laptop",
  "createdAt": "2025-10-20T01:07:00.018Z",
  "updatedAt": "2025-10-20T01:07:00.020Z"
}
```

**Response (404):**
```json
{
  "error": "Not found"
}
```

**cURL Example:**
```bash
curl http://localhost:80/api/items/1
```

---

### 4. Update Item
**PUT** `/api/items/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "createdAt": "2025-10-20T01:07:00.018Z",
  "updatedAt": "2025-10-20T01:08:00.270Z"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:80/api/items/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Gaming Laptop"}'
```

---

### 5. Delete Item
**DELETE** `/api/items/:id`

**Response (200):**
```json
{
  "success": true,
  "id": 1
}
```

**Response (404):**
```json
{
  "error": "Not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:80/api/items/1
```

---

## Database Schema

### Items Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| name | STRING | NOT NULL |
| description | TEXT | NULL |
| createdAt | DATE | NOT NULL |
| updatedAt | DATE | NOT NULL |

## Sequelize CLI Commands

### Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Create New Migration
```bash
npx sequelize-cli migration:generate --name migration-name
```

### Rollback Last Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Create Model
```bash
npx sequelize-cli model:generate --name ModelName --attributes field1:string,field2:integer
```

## Deployment

### Build and Deploy
```bash
/home/ec2-user/CSE3CWA---Assignment-2/compose-deploy.sh
```

### Check Status
```bash
docker compose ps
docker compose logs -f nextjs-app
```

### Test Health
```bash
curl -I localhost:80
```

## Technical Implementation

### Files Created/Modified
- `lib/db.ts` - Sequelize setup with lazy initialization
- `models/item.js` - Item model (Sequelize CLI format)
- `migrations/20251020000101-create-item.js` - Initial migration
- `app/api/items/route.ts` - CREATE & LIST endpoints
- `app/api/items/[id]/route.ts` - READ, UPDATE, DELETE endpoints
- `next.config.ts` - Webpack externals for sqlite3
- `config/config.json` - Sequelize configuration (SQLite)

### Key Features
- **Runtime DB Init**: Lazy-loaded to avoid build-time sqlite3 loading
- **Singleton Pattern**: Global caching prevents redundant connections
- **Auto-sync**: Database tables created automatically on first request
- **Type Safety**: TypeScript with Sequelize model types
- **Docker Ready**: Externalized native modules for containerized builds

## Testing Results

✅ **CREATE**: Successfully creates items with auto-generated IDs and timestamps  
✅ **READ (List)**: Returns all items in JSON array  
✅ **READ (Single)**: Fetches individual item by ID  
✅ **UPDATE**: Updates item fields and timestamp  
✅ **DELETE**: Removes item and returns success confirmation  

---

**Last Updated**: October 20, 2025  
**API Version**: 1.0  
**Database**: SQLite 3 with Sequelize ORM
