# T Code Challenge

This project provides a Node.js backend service for managing customers and their credits. It includes a clean architecture setup with services, controllers, domain entities, and a PostgreSQL database.

## Requirements

- Node.js (>= 18)
- npm
- Docker & Docker Compose (optional but recommended)

## Getting Started

You can run the project either locally using Node.js or using Docker.

---

## 🚀 Running Locally (Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/t-code-challenge.git
cd t-code-challenge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Copy `.env` to `.env.local` and update the variables:
```bash
cp .env .env.local
```

### 4. Run Migrations and Seeds
```bash
npm run migrate
npm run seed
```

### 5. Start the Server
```bash
npm start
```

The server should be running on `http://localhost:3000`.

---

## 🐳 Running with Docker

### 1. Build and Start the Project
```bash
make all
```
This will:
- Build Docker images
- Start the services
- Install dependencies
- Run migrations and seed the database

### 2. Useful Commands

| Command         | Description                           |
|----------------|---------------------------------------|
| `make up`      | Start services in detached mode       |
| `make stop`    | Stop running containers               |
| `make down`    | Stop and remove containers and volumes|
| `make bash`    | Open a shell in the app container     |
| `make install` | Run `npm install` in the container    |
| `make update`  | Run `npm update` in the container     |
| `make migrate` | Run database migrations               |
| `make seed`    | Seed the database                     |
| `make lint`    | Lint the project                      |
| `make lint-fix`| Auto-fix lint issues                  |
| `make test`    | Run the test suite                    |
| `make logs`    | View container logs                   |

The app will be available at `http://localhost:3000`.

---

## 🧪 Running Tests

Run tests with coverage:
```bash
npm test
```

Or using Docker:
```bash
make test
```

---

## 📁 Project Structure

```
├── src
│   ├── application
│   │   └── services
│   ├── common
│   ├── domain
│   │   ├── entities
│   │   ├── enums
│   │   └── repositories
│   └── infrastructure
│       ├── controllers
│       ├── errors
│       ├── migrations
│       ├── persistence
│       ├── seeds
│       ├── db.js
│       └── routes.js
├── tests
├── .env
├── .env.local
├── .gitattributes
├── .gitignore
├── compose.override.yaml
├── compose.yaml
├── Dockerfile
├── eslint.config.js
├── jest.config.js
├── knexfile.js
├── Makefile
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── serverless.yaml
```

---

## 📝 License

MIT
